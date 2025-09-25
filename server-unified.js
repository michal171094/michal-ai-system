// Unified server combining AgentCore (priorities/questions) + Gmail + existing mock data
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const GmailService = require('./services/GmailService');
const AgentCore = require('./services/AgentCore');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());
// Basic security hardening
app.use(helmet({ crossOriginResourcePolicy: false }));
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
app.use('/api/', apiLimiter);

// File upload (OCR) setup
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
app.use(express.static('.'));

// Data persistence for primary domain data
const DATA_FILE = path.join(__dirname, 'data', 'appData.json');
function loadAppData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) { console.warn('⚠️ loadAppData failed', e.message); }
  return { tasks: [], debts: [], bureaucracy: [], emails: [] };
}
function saveAppData() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2));
  } catch (e) { console.warn('⚠️ saveAppData failed', e.message); }
}
let appData = loadAppData();

// Start with empty data - no demo seeding
console.log(`📊 Loaded data: ${appData.tasks?.length || 0} tasks, ${appData.debts?.length || 0} debts, ${appData.bureaucracy?.length || 0} bureaucracy items, ${appData.emails?.length || 0} emails`);

// Gmail init (optional) - ensure non-blocking startup
let gmailService = null;
try { 
  gmailService = new GmailService(); 
  console.log('📨 Gmail ready'); 
} catch (e) { 
  console.warn('📨 Gmail disabled (non-critical):', e.message); 
}

// Non-blocking AgentCore init to prevent startup crashes
try {
  AgentCore.ingestInitial(appData);
  console.log('🧠 AgentCore initialized');
} catch (e) {
  console.warn('🧠 AgentCore init warning:', e.message);
}

function buildSmartOverviewPayload(appData) {
  const priorities = AgentCore.getPriorities(appData);
  const stats = {
    total: priorities.length,
    critical: 0,
    urgent: 0,
    pending: 0,
    emailTasks: 0
  };
  const now = Date.now();
  priorities.forEach(item => {
    if (item.domain === 'email') stats.emailTasks += 1;
    if (item.deadline) {
      const diffDays = Math.ceil((new Date(item.deadline).getTime() - now)/86400000);
      if (diffDays <= 0) stats.critical += 1;
      else if (diffDays <= 3) stats.urgent += 1;
      else if (diffDays <= 7) stats.pending += 1;
    } else {
      stats.pending += 1;
    }
  });
  const domains = {
    academic: appData.tasks || [],
    debts: appData.debts || [],
    bureaucracy: appData.bureaucracy || [],
    emails: (appData.emails || []).slice(-200)
  };
  return { priorities, stats, domains, lastUpdated: new Date().toISOString() };
}

// ---------- Generic CRUD (simplified) ----------
app.get('/api/tasks', (req,res)=> res.json({ success:true, data: appData.tasks }));
app.post('/api/tasks', (req,res)=> { const t = req.body; t.id = Date.now(); appData.tasks.push(t); saveAppData(); AgentCore.memory.addEvent('task_created', {id:t.id}); res.json({success:true, data:t}); });
app.put('/api/tasks/:id', (req,res)=> {
  const id = Number(req.params.id);
  const idx = appData.tasks.findIndex(t=> Number(t.id) === id);
  if (idx === -1) return res.status(404).json({ success:false, error:'task not found' });
  appData.tasks[idx] = { ...appData.tasks[idx], ...req.body, id };
  saveAppData();
  AgentCore.memory.addEvent('task_updated', { id, changes: req.body });
  res.json({ success:true, data: appData.tasks[idx] });
});

app.get('/api/debts', (req,res)=> res.json({ success:true, data: appData.debts }));
app.post('/api/debts', (req,res)=> { const d = req.body; d.id = Date.now(); appData.debts.push(d); saveAppData(); AgentCore.memory.addEvent('debt_created', {id:d.id}); res.json({success:true, data:d}); });
app.put('/api/debts/:id', (req,res)=> {
  const id = Number(req.params.id);
  const idx = appData.debts.findIndex(d=> Number(d.id) === id);
  if (idx === -1) return res.status(404).json({ success:false, error:'debt not found' });
  appData.debts[idx] = { ...appData.debts[idx], ...req.body, id };
  saveAppData();
  AgentCore.memory.addEvent('debt_updated', { id, changes: req.body });
  res.json({ success:true, data: appData.debts[idx] });
});

app.get('/api/bureaucracy', (req,res)=> res.json({ success:true, data: appData.bureaucracy }));
app.post('/api/bureaucracy', (req,res)=> { const b = req.body; b.id = Date.now(); appData.bureaucracy.push(b); saveAppData(); AgentCore.memory.addEvent('bureau_created', {id:b.id}); res.json({success:true, data:b}); });
app.put('/api/bureaucracy/:id', (req,res)=> {
  const id = Number(req.params.id);
  const idx = appData.bureaucracy.findIndex(b=> Number(b.id) === id);
  if (idx === -1) return res.status(404).json({ success:false, error:'bureaucracy item not found' });
  appData.bureaucracy[idx] = { ...appData.bureaucracy[idx], ...req.body, id };
  saveAppData();
  AgentCore.memory.addEvent('bureau_updated', { id, changes: req.body });
  res.json({ success:true, data: appData.bureaucracy[idx] });
});

// ---------- AgentCore endpoints ----------
app.post('/api/agent/finance/balance', (req,res)=> { const { balance } = req.body; if (typeof balance !== 'number') return res.status(400).json({success:false,error:'balance must be number'}); AgentCore.updateFinancialBalance(balance); return res.json({success:true, stored: balance}); });
app.get('/api/agent/priorities', (req,res)=> { try { const ranked = AgentCore.getPriorities(appData); res.json({success:true, data: ranked}); } catch(e){ res.status(500).json({success:false,error:e.message}); } });
app.get('/api/agent/questions', (req,res)=> { try { const q = AgentCore.generateQuestions(appData); res.json({success:true, data:q}); } catch(e){ res.status(500).json({success:false,error:e.message}); } });
app.post('/api/agent/questions/:id/answer', (req,res)=> { const ok = AgentCore.memory.answerQuestion(req.params.id, req.body.answer); AgentCore.memory.persist(); res.json({success:ok}); });
app.post('/api/agent/sync/simulate', (req,res)=> { res.json({success:true, data: AgentCore.runSyncSimulation(req.body?.sources)}); });
app.get('/api/agent/state', (req,res)=> { res.json({success:true, data: AgentCore.stateSnapshot(appData)}); });
// Metrics endpoint
app.get('/api/agent/metrics', (req,res)=> { try { res.json({ success:true, data: AgentCore.metrics(appData) }); } catch(e){ res.status(500).json({success:false,error:e.message}); } });
// Auto actions suggestions
app.get('/api/agent/auto-actions', (req,res)=> { try { const acts = AgentCore.generateAutoActions(appData); res.json({success:true, data:acts}); } catch(e){ res.status(500).json({success:false,error:e.message}); } });

// ---------- Gmail Integration / Ingest ----------
app.get('/api/gmail/status', (req,res)=> {
  if (!gmailService) return res.json({ configured:false, authenticated:false, accounts:[] });
  const meta = gmailService.listAccounts();
  res.json({
    configured: meta.configured,
    authenticated: gmailService.hasValidTokens(),
    accounts: meta.accounts,
    activeEmail: meta.activeEmail
  });
});
// consolidated connectors status (future other services)
app.get('/api/connectors/status', (req,res)=> {
  const gmailMeta = gmailService ? gmailService.listAccounts() : { configured:false, accounts:[], activeEmail:null };
  res.json({
    success: true,
    data: {
      gmail: {
        configured: gmailMeta.configured,
        accounts: gmailMeta.accounts,
        activeEmail: gmailMeta.activeEmail,
        authenticated: gmailService ? gmailService.hasValidTokens() : false
      }
    }
  });
});
app.get('/api/gmail/auth-url', (req,res)=> { if(!gmailService) return res.status(503).json({error:'Gmail service disabled'}); res.json({ url: gmailService.getAuthUrl() }); });
app.get('/auth/google/callback', async (req,res)=> {
  if(!gmailService) return res.status(503).send('Gmail off');
  const { code } = req.query;
  if(!code) return res.redirect('/?gmail=missing_code');
  try {
    const result = await gmailService.exchangeCodeForTokens(code);
    const emailParam = result?.email ? `&connected=${encodeURIComponent(result.email)}` : '';
    return res.redirect('/?gmail=connected' + emailParam);
  } catch(e){
    console.error('OAuth error', e.message);
    return res.redirect('/?gmail=error');
  }
});
app.get('/api/gmail/accounts', (req,res)=> {
  if (!gmailService) return res.status(503).json({ success:false, error:'Gmail service disabled' });
  res.json({ success:true, data: gmailService.listAccounts() });
});
app.post('/api/gmail/accounts/activate', (req,res)=> {
  if (!gmailService) return res.status(503).json({ success:false, error:'Gmail service disabled' });
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ success:false, error:'email required' });
  try {
    const meta = gmailService.setActiveAccount(email);
    res.json({ success:true, data: meta });
  } catch (e) {
    res.status(404).json({ success:false, error:e.message });
  }
});
app.delete('/api/gmail/accounts/:email', (req,res)=> {
  if (!gmailService) return res.status(503).json({ success:false, error:'Gmail service disabled' });
  const email = decodeURIComponent(req.params.email);
  const removed = gmailService.removeAccount(email);
  res.json({ success: removed, data: gmailService.listAccounts() });
});

// Pull recent emails and ingest into AgentCore/appData
app.post('/api/gmail/sync', async (req,res)=> {
  if (!gmailService) return res.status(503).json({ success:false, error:'Gmail disabled'});
  try {
    if (!gmailService.hasValidTokens()) {
      return res.status(401).json({ success:false, auth_required:true });
    }
    const emails = await gmailService.listRecentEmails(30);
    let newCount = 0;
    appData.emails = appData.emails || [];
    const existingIds = new Set(appData.emails.map(e=> e.id));
    const newEmails = [];
    emails.forEach(em => { if(!existingIds.has(em.id)) { const simplified = { id: em.id, subject: em.subject, from: em.from, date: em.date, snippet: em.snippet }; appData.emails.push(simplified); newEmails.push(simplified); newCount++; } });
    if (newCount) { saveAppData(); AgentCore.memory.addEvent('emails_ingested', { count:newCount }); }
    // Link emails to existing entities for prioritization signals
    const linkStats = AgentCore.priorityEngine.ingestEmails(appData, newEmails);
    const priorities = AgentCore.getPriorities(appData).slice(0,20);
    res.json({ success:true, ingested:newCount, linked: linkStats.linked, total: appData.emails.length, priorities });
  } catch (e) {
    if (e.message === 'AUTH_REQUIRED') return res.status(401).json({ success:false, auth_required:true });
    res.status(500).json({ success:false, error:e.message });
  }
});

// List emails with optional entity linkage filter (basic: filter by case_number or subject token)
app.get('/api/emails', (req,res)=> {
  try {
    AgentCore.enrichEmails(appData);
    const { q } = req.query;
    let emails = appData.emails || [];
    if (q) {
      const needle = q.toLowerCase();
      emails = emails.filter(e => (e.subject||'').toLowerCase().includes(needle) || (e.snippet||'').toLowerCase().includes(needle));
    }
    // Group by threadId when available
    const grouped = {};
    emails.slice(-400).forEach(e => {
      const key = e.threadId || e.id;
      if (!grouped[key]) grouped[key] = { threadId: key, emails: [], lastDate: e.date, tags: new Set(), subject: e.subject };
      grouped[key].emails.push(e);
      if (e.date && (!grouped[key].lastDate || new Date(e.date) > new Date(grouped[key].lastDate))) grouped[key].lastDate = e.date;
      (e.tags||[]).forEach(t=> grouped[key].tags.add(t));
      if (!grouped[key].subject && e.subject) grouped[key].subject = e.subject;
    });
    const threadArray = Object.values(grouped).map(t => ({
      threadId: t.threadId,
      subject: t.subject,
      count: t.emails.length,
      lastDate: t.lastDate,
      tags: Array.from(t.tags),
      preview: t.emails.slice(-1)[0]?.snippet || ''
    })).sort((a,b)=> new Date(b.lastDate) - new Date(a.lastDate)).slice(0,200);
    res.json({ success:true, data: emails.slice(-200), threads: threadArray });
  } catch (e) {
    res.status(500).json({ success:false, error:e.message });
  }
});

// OCR upload route (bridged to AI agent if configured)
app.post('/api/upload-document', upload.single('document'), async (req,res)=> {
  try {
    if (!req.file) return res.status(400).json({ success:false, error:'לא הועלה קובץ' });
    const fileInfo = { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype };
    const AI_URL = process.env.AI_AGENT_URL || AI_AGENT_URL; // ensure variable
    let ocrResult = null; let fallback = false;
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
      const ocrResp = await axios.post(`${AI_AGENT_URL}/ocr-process`, formData, { headers: formData.getHeaders(), timeout: 30000 });
      ocrResult = ocrResp.data;
    } catch (err) {
      fallback = true;
      ocrResult = { success:false, note:'OCR agent not reachable - fallback basic classification', filename: fileInfo.name };
    } finally {
      try { fs.unlinkSync(req.file.path); } catch(_e){}
    }
    res.json({ success:true, file: fileInfo, ocr: ocrResult, fallback });
  } catch (e) {
    res.status(500).json({ success:false, error:e.message });
  }
});

// Background polling (every 15 min) if authenticated
if (process.env.GMAIL_BACKGROUND_SYNC === '1') {
  setInterval(async () => {
    try {
      if (!gmailService || !gmailService.hasValidTokens()) return;
      const emails = await gmailService.listRecentEmails(15);
      const existing = new Set((appData.emails||[]).map(e=>e.id));
      const newEmails = [];
      emails.forEach(em => { if(!existing.has(em.id)) { const simplified = { id: em.id, subject: em.subject, from: em.from, date: em.date, snippet: em.snippet }; (appData.emails|| (appData.emails= [])).push(simplified); newEmails.push(simplified); } });
      if (newEmails.length) {
        saveAppData();
        AgentCore.memory.addEvent('emails_ingested_background', { count:newEmails.length });
        AgentCore.priorityEngine.ingestEmails(appData, newEmails);
        console.log('📥 Background Gmail sync ingested', newEmails.length);
      }
    } catch (e) {
      console.warn('Background Gmail sync failed:', e.message);
    }
  }, 15 * 60 * 1000);
}

// ---------- Smart overview (reuse AgentCore priorities preview) ----------
app.get('/api/smart-overview', (req,res)=> {
  try {
    const payload = buildSmartOverviewPayload(appData);
    res.json({
      success: true,
      data: {
        stats: payload.stats,
        priorities: payload.priorities.slice(0,50),
        topPriorities: payload.priorities.slice(0,20),
        domains: {
          academic: payload.domains.academic,
          debts: payload.domains.debts,
          bureaucracy: payload.domains.bureaucracy,
          emails: payload.domains.emails
        },
        lastUpdated: payload.lastUpdated
      }
    });
  } catch(e){
    res.status(500).json({success:false,error:e.message});
  }
});

// Health
app.get('/api/health', (_req,res)=> res.json({ status:'OK', ts: new Date().toISOString() }));

// Start server with proper error handling
const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 Unified server running on :${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('🔄 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🔄 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught errors without crashing
process.on('uncaughtException', (err) => {
  console.error('🚨 Uncaught Exception:', err);
  // Don't exit in production
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit in production
});
