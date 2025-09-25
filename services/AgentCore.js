// AgentCore - High level intelligent orchestration layer
// Provides: memory, knowledge graph, priority scoring, question generation, sync simulation

const fs = require('fs');
const path = require('path');

class MemoryStore {
    constructor() {
        this.events = [];           // chronological events
        this.facts = new Map();     // key -> value (latest)
        this.entityHistory = new Map(); // entityId -> [{timestamp, data}]
        this.questions = [];        // pending clarification questions
        this.answers = [];          // answered clarifications
        this.lastRebuild = null;
        this.persistenceFile = path.join(__dirname, '..', 'data', 'memory.json');
        this.ensurePersistenceDir();
        this.load();
    }
    ensurePersistenceDir() {
        const dir = path.dirname(this.persistenceFile);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }
    load() {
        try {
            if (fs.existsSync(this.persistenceFile)) {
                const raw = JSON.parse(fs.readFileSync(this.persistenceFile, 'utf8'));
                Object.assign(this, raw);
            }
        } catch (e) {
            console.error('⚠️ Memory load failed', e.message);
        }
    }
    persist() {
        try {
            fs.writeFileSync(this.persistenceFile, JSON.stringify({
                events: this.events.slice(-5000), // cap
                facts: Array.from(this.facts.entries()),
                entityHistory: Array.from(this.entityHistory.entries()),
                questions: this.questions,
                answers: this.answers,
                lastRebuild: this.lastRebuild
            }));
        } catch (e) {
            console.error('⚠️ Memory persist failed', e.message);
        }
    }
    addEvent(type, payload) {
        const evt = { id: 'evt_' + Date.now() + '_' + Math.random().toString(36).slice(2), timestamp: new Date().toISOString(), type, payload };
        this.events.push(evt);
        if (this.events.length > 10000) this.events.shift();
        return evt;
    }
    setFact(key, value) {
        this.facts.set(key, { value, ts: Date.now() });
    }
    addEntitySnapshot(id, data) {
        if (!this.entityHistory.has(id)) this.entityHistory.set(id, []);
        this.entityHistory.get(id).push({ ts: Date.now(), data });
        if (this.entityHistory.get(id).length > 50) this.entityHistory.get(id).shift();
    }
    enqueueQuestion(q) { this.questions.push(q); }
    answerQuestion(id, answer) {
        const idx = this.questions.findIndex(q => q.id === id);
        if (idx !== -1) {
            const q = this.questions.splice(idx, 1)[0];
            this.answers.push({ ...q, answer, answeredAt: new Date().toISOString() });
            return true;
        }
        return false;
    }
    pendingQuestions() { return this.questions; }
}

class KnowledgeGraph {
    constructor() {
        this.nodes = new Map(); // id -> {id,type,props}
        this.edges = [];        // {from,to,type,props}
        this.version = 0;
    }
    upsertNode(id, type, props = {}) {
        const existing = this.nodes.get(id) || { id, type, props: {} };
        existing.type = type;
        existing.props = { ...existing.props, ...props, updatedAt: new Date().toISOString() };
        this.nodes.set(id, existing);
        this.version++;
        return existing;
    }
    link(from, to, type, props = {}) {
        this.edges.push({ from, to, type, props, ts: Date.now() });
        if (this.edges.length > 5000) this.edges.shift();
        this.version++;
    }
    getNode(id) { return this.nodes.get(id); }
    snapshot() {
        return {
            nodes: Array.from(this.nodes.values()).slice(0, 500),
            edges: this.edges.slice(-1000),
            version: this.version
        };
    }
}

class PriorityEngine {
    constructor(memory, graph) {
        this.memory = memory;
        this.graph = graph;
    }
    scoreItem(item, context = {}) {
        // Base score factors
        let score = 0;
        const now = Date.now();
        // Deadline
        if (item.deadline) {
            const diffDays = (new Date(item.deadline) - now) / 86400000;
            if (diffDays < 0) score += 120; // overdue
            else if (diffDays <= 0) score += 110;
            else if (diffDays <= 1) score += 100;
            else if (diffDays <= 3) score += 85;
            else if (diffDays <= 7) score += 60;
            else if (diffDays <= 14) score += 40;
        } else {
            score += 10; // unknown deadline
        }
        // Domain weighting
        const domainWeights = { debt: 40, bureaucracy: 30, academic: 20, email: 15 };
        score += domainWeights[item.domain] || 10;
        // Financial impact
        if (item.amount) {
            const amt = Number(item.amount) || 0;
            if (amt > 5000) score += 50; else if (amt > 1000) score += 35; else if (amt > 300) score += 20; else if (amt > 0) score += 10;
        }
        // Status urgency
        const statusWeights = { 'התראה': 40, 'פתוח': 25, 'בהתנגדות': 30, 'בהמתנה': 10 };
        score += statusWeights[item.status] || 5;
        // If relates to client with active edge 'VIP'
        if (item.client && this.graph.getNode('client_'+item.client)?.props?.tier === 'VIP') score += 25;
        // If memory indicates low balance & this is debt -> escalate
        const balance = this.memory.facts.get('finance.currentBalance')?.value;
        if (balance !== undefined && item.domain === 'debt') {
            if (balance < 1000) score += 30;
            if (balance < (item.amount || 0)) score += 15;
        }
        return Math.round(score);
    }
    rank(items) {
        return items.map(i => ({ ...i, priorityScore: this.scoreItem(i) }))
            .sort((a,b)=> b.priorityScore - a.priorityScore)
            .slice(0, 100);
    }
}

class QuestionEngine {
    constructor(memory) { this.memory = memory; }
    generate(dataSet) {
        const questions = [];
        // Missing financial balance
        if (!this.memory.facts.get('finance.currentBalance')) {
            questions.push({ id: 'q_balance', topic: 'finance', question: 'מה היתרה העדכנית בחשבון העו"ש שלך היום?', importance: 'high' });
        }
        // Debts missing case numbers
        const missingCase = dataSet.debts?.filter(d => !d.case_number).slice(0,2) || [];
        missingCase.forEach((d,i)=>{
            questions.push({ id: 'q_debtcase_'+i, topic: 'debts', question: `יש חוב של ${d.creditor || 'גורם לא ידוע'} ללא מספר תיק – מה מספר התיק?`, importance: 'medium' });
        });
        // Documents required but not found
        const needDocs = dataSet.bureaucracy?.filter(b => b.action && b.action.includes('מסמכים')) || [];
        needDocs.slice(0,1).forEach(b=>{
            questions.push({ id: 'q_doc_'+b.id, topic: 'documents', question: `בשביל '${b.task}' – האם כבר העלית את כל המסמכים הנדרשים?`, importance: 'medium' });
        });
        // Only add new unanswered
        const existingIds = new Set(this.memory.pendingQuestions().map(q=>q.id));
        questions.filter(q=>!existingIds.has(q.id)).forEach(q=> this.memory.enqueueQuestion({ ...q, createdAt: new Date().toISOString() }));
        return this.memory.pendingQuestions();
    }
}

class AgentCore {
    constructor() {
        this.memory = new MemoryStore();
        this.graph = new KnowledgeGraph();
        this.priorityEngine = new PriorityEngine(this.memory, this.graph);
        this.questionEngine = new QuestionEngine(this.memory);
        this.lastSyncStats = null;
    }
    ingestInitial(appData) {
        if (!appData) return;
        // populate knowledge graph
        (appData.tasks||[]).forEach(t=>{
            this.graph.upsertNode('task_'+t.id, 'task', t);
            if (t.client) this.graph.upsertNode('client_'+t.client, 'client', { name: t.client });
        });
        (appData.debts||[]).forEach(d=>{
            this.graph.upsertNode('debt_'+d.id, 'debt', d);
        });
        (appData.bureaucracy||[]).forEach(b=>{
            this.graph.upsertNode('bureau_'+b.id, 'bureaucracy_task', b);
        });
        this.memory.addEvent('initial_ingest', { counts: { tasks: appData.tasks?.length, debts: appData.debts?.length, bureaucracy: appData.bureaucracy?.length }});
        this.memory.persist();
    }
    updateFinancialBalance(balance) {
        this.memory.setFact('finance.currentBalance', balance);
        this.memory.addEvent('finance_balance_update', { balance });
        this.memory.persist();
    }
    buildUnifiedItems(appData) {
        const list = [];
        (appData.tasks||[]).forEach(t=> list.push({ id: 'task_'+t.id, domain: 'academic', title: t.project, deadline: t.deadline, status: t.status, client: t.client, action: t.action, amount: t.value, currency: t.currency }));
        (appData.debts||[]).forEach(d=> list.push({ id: 'debt_'+d.id, domain: 'debt', title: d.company + ' - ' + d.creditor, deadline: d.deadline, status: d.status, action: d.action, amount: d.amount, currency: d.currency, case_number: d.case_number }));
        (appData.bureaucracy||[]).forEach(b=> list.push({ id: 'bureau_'+b.id, domain: 'bureaucracy', title: b.task + ' - ' + b.authority, deadline: b.deadline, status: b.status, action: b.action }));
        return list;
    }
    getPriorities(appData) {
        const unified = this.buildUnifiedItems(appData);
        const ranked = this.priorityEngine.rank(unified);
        this.memory.addEvent('priority_calculated', { total: unified.length });
        return ranked;
    }
    generateQuestions(appData) {
        return this.questionEngine.generate(appData);
    }
    runSyncSimulation(sources= ['emails','debts','bureaucracy','academic']) {
        // simulate durations
        const result = sources.map(src=> ({ source: src, items: Math.floor(Math.random()*5)+1, durationMs: 300 + Math.floor(Math.random()*700) }));
        this.lastSyncStats = { at: new Date().toISOString(), result };
        this.memory.addEvent('sync_run', this.lastSyncStats);
        this.memory.persist();
        return this.lastSyncStats;
    }
    stateSnapshot(appData) {
        return {
            version: 1,
            memory: {
                events: this.memory.events.slice(-20),
                facts: Object.fromEntries(this.memory.facts),
                pendingQuestions: this.memory.pendingQuestions()
            },
            knowledgeGraph: this.graph.snapshot(),
            lastSync: this.lastSyncStats,
            prioritiesPreview: this.getPriorities(appData).slice(0,10)
        };
    }
}

module.exports = new AgentCore();
