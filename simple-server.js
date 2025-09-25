const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';
const AgentCore = require('./services/AgentCore');

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('.'));

// ---------- AgentCore bootstrap (initial ingest of mock data) ----------
let INITIAL_DATA_INGESTED = false;
function ensureInitialIngest() {
    if (!INITIAL_DATA_INGESTED) {
        try {
            AgentCore.ingestInitial(appData);
            INITIAL_DATA_INGESTED = true;
            console.log('🤖 AgentCore initial data ingested');
        } catch (e) {
            console.error('⚠️ Failed ingest initial data:', e.message);
        }
    }
}
ensureInitialIngest();

// Mock data - Full Data Set
const appData = {
    tasks: [
        {id: 1, project: "כרמית - סמינר פסיכולוגיה", client: "כרמית", deadline: "2025-09-24", status: "בעבודה", priority: "דחוף", value: 3500, currency: "₪", action: "שליחת טיוטה", module: "academic"},
        {id: 2, project: "ישראל - סמינר היסטוריה", client: "ישראל", deadline: "2025-09-28", status: "המתנה לאישור", priority: "גבוה", value: 4200, currency: "₪", action: "מעקב אחר מענה", module: "academic"},
        {id: 3, project: "מרג'ורי - תרגום מסמכים", client: "מרג'ורי", deadline: "2025-10-01", status: "בבדיקה", priority: "בינוני", value: 450, currency: "€", action: "בירור סטטוס", module: "academic"}
    ],
    bureaucracy: [
        {id: 1, task: "רישום נישואין", authority: "Standesamt Berlin", status: "בהמתנה", deadline: "2025-10-15", action: "בירור סטטוס בקשה", priority: "גבוה"},
        {id: 2, task: "ביטוח בריאות - אוריון", authority: "TK", status: "טרם פתור", deadline: "2025-09-30", action: "הגשת מסמכים", priority: "דחוף"},
        {id: 3, task: "בקשת אישור שהייה", authority: "LEA Berlin", status: "בהליך", deadline: "2025-11-01", action: "מעקב אחר בקשה", priority: "בינוני"},
        {id: 4, task: "דיווח Bürgergeld", authority: "Jobcenter", status: "מאושר", deadline: "2025-10-31", action: "דיווח חודשי", priority: "נמוך"}
    ],
    debts: [
        {id: 1, creditor: "PAIR Finance", company: "Immobilien Scout", amount: 69.52, currency: "€", case_number: "120203581836", status: "פתוח", action: "שליחת התנגדות", priority: "דחוף", deadline: "2025-09-27"},
        {id: 2, creditor: "PAIR Finance", company: "Free2Move", amount: 57, currency: "€", case_number: "162857501033", status: "פתוח", action: "בירור חוב", priority: "גבוה", deadline: "2025-09-29"},
        {id: 3, creditor: "PAIR Finance", company: "Novum Cashper", amount: 208.60, currency: "€", case_number: "168775195683", status: "פתוח", action: "הצעת פשרה", priority: "בינוני", deadline: "2025-10-05"},
        {id: 4, creditor: "coeo Inkasso", company: "Ostrom GmbH", amount: 455, currency: "€", case_number: "1660002492", status: "בהתנגדות", action: "המשך התנגדות", priority: "גבוה", deadline: "2025-10-01"},
        {id: 5, creditor: "רשות אכיפה", company: "משרד הבטחון", amount: 7355.17, currency: "₪", case_number: "774243-03-25", status: "התראה", action: "תיאום תשלומים", priority: "דחוף", deadline: "2025-09-30"}
    ]
};

// Helper function for Smart Overview
function processUnifiedTasks(tasks, debts, bureaucracy) {
    const unified = [];
    
    // Process academic tasks
    tasks.forEach(task => {
        unified.push({
            id: `task-${task.id}`,
            title: task.project,
            description: `לקוח: ${task.client}`,
            deadline: task.deadline,
            status: task.status,
            priority: task.priority,
            action: task.action,
            domain: 'academic',
            value: task.value,
            currency: task.currency
        });
    });
    
    // Process debts
    debts.forEach(debt => {
        unified.push({
            id: `debt-${debt.id}`,
            title: `${debt.company} - ${debt.creditor}`,
            description: `מספר תיק: ${debt.case_number}`,
            deadline: debt.deadline,
            status: debt.status,
            priority: debt.priority,
            action: debt.action,
            domain: 'debt',
            value: debt.amount,
            currency: debt.currency
        });
    });
    
    // Process bureaucracy
    bureaucracy.forEach(item => {
        unified.push({
            id: `bureau-${item.id}`,
            title: item.task,
            description: `רשות: ${item.authority}`,
            deadline: item.deadline,
            status: item.status,
            priority: item.priority,
            action: item.action,
            domain: 'bureaucracy',
            value: null,
            currency: null
        });
    });
    
    return unified;
}

// API Routes
app.get('/api/tasks', async (req, res) => {
    try {
        res.json({ success: true, data: appData.tasks });
    } catch (error) {
        console.error('שגיאה בטעינת משימות:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/debts', async (req, res) => {
    try {
        res.json({ success: true, data: appData.debts });
    } catch (error) {
        console.error('שגיאה בטעינת חובות:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/bureaucracy', async (req, res) => {
    try {
        res.json({ success: true, data: appData.bureaucracy });
    } catch (error) {
        console.error('שגיאה בטעינת בירוקרטיה:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Smart Overview API
app.get('/api/smart-overview', async (req, res) => {
    try {
        console.log('🔍 מעבד סקירה חכמה...');
        
        const unifiedTasks = processUnifiedTasks(appData.tasks, appData.debts, appData.bureaucracy);
        
        // חישוב עדיפות AI חכמה
        const smartPrioritized = unifiedTasks.map(item => {
            let aiPriority = 0;
            let urgencyLevel = 'נמוך';
            
            // חישוב זמן שנותר
            if (item.deadline) {
                const today = new Date();
                const deadlineDate = new Date(item.deadline);
                const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
                
                if (daysLeft < 0) {
                    aiPriority += 100; // איחור
                    urgencyLevel = 'קריטי';
                } else if (daysLeft === 0) {
                    aiPriority += 90; // היום
                    urgencyLevel = 'קריטי';
                } else if (daysLeft === 1) {
                    aiPriority += 80; // מחר
                    urgencyLevel = 'קריטי';
                } else if (daysLeft <= 3) {
                    aiPriority += 70; // תוך 3 ימים
                    urgencyLevel = 'גבוה מאוד';
                } else if (daysLeft <= 7) {
                    aiPriority += 50; // השבוע
                    urgencyLevel = 'גבוה';
                } else if (daysLeft <= 14) {
                    aiPriority += 30; // שבועיים
                    urgencyLevel = 'בינוני';
                }
                
                item.daysLeft = daysLeft;
                item.timeRemaining = daysLeft < 0 ? 'איחור' :
                                   daysLeft === 0 ? 'היום' :
                                   daysLeft === 1 ? 'מחר' :
                                   `${daysLeft} ימים`;
            } else {
                item.daysLeft = 999;
                item.timeRemaining = 'ללא דדליין';
            }
            
            // חישוב על בסיס עדיפות קיימת
            const priorityMap = {
                'דחוף': 40,
                'גבוה': 30,
                'בינוני': 20,
                'נמוך': 10
            };
            aiPriority += priorityMap[item.priority] || 10;
            
            // חישוב על בסיס תחום
            const domainBonus = {
                'debt': 25, // חובות חשובים יותר
                'bureaucracy': 20, // בירוקרטיה יכולה להיות דחופה
                'academic': 15 // אקדמיה פחות דחופה
            };
            aiPriority += domainBonus[item.domain] || 0;
            
            // חישוב על בסיס סטטוס
            const statusBonus = {
                'פתוח': 15,
                'בהתנגדות': 12,
                'התראה': 20,
                'טרם פתור': 18,
                'בהמתנה': 10
            };
            aiPriority += statusBonus[item.status] || 5;
            
            item.aiPriority = Math.min(aiPriority, 200); // מקסימום 200
            item.urgencyLevel = urgencyLevel;
            
            return item;
        });
        
        // מיון לפי עדיפות AI
        smartPrioritized.sort((a, b) => b.aiPriority - a.aiPriority);
        
        // חישוב סטטיסטיקות
        const stats = {
            critical: smartPrioritized.filter(item => item.urgencyLevel === 'קריטי').length,
            urgent: smartPrioritized.filter(item => ['גבוה מאוד', 'גבוה'].includes(item.urgencyLevel)).length,
            pending: smartPrioritized.filter(item => item.status !== 'סגור' && item.status !== 'הושלם').length,
            emailTasks: 0 // נוסיף בהמשך
        };
        
        res.json({ 
            success: true, 
            data: smartPrioritized.slice(0, 20), // רק 20 הראשונים
            stats,
            totalItems: smartPrioritized.length
        });
        
    } catch (error) {
        console.error('שגיאה בסקירה חכמה:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Authentication routes (mock)
app.post('/api/auth/login', (req, res) => {
    res.json({ 
        success: true, 
        message: 'התחברת בהצלחה',
        user: { id: 1, name: 'מיכל' }
    });
});

app.get('/api/auth/me', (req, res) => {
    res.json({ 
        success: true, 
        data: { user: { id: 1, name: 'מיכל', email: 'michal@example.com' } }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ---------- AgentCore intelligent orchestration endpoints ----------
app.post('/api/agent/finance/balance', (req, res) => {
    try {
        const { balance } = req.body;
        if (typeof balance !== 'number') return res.status(400).json({ success:false, error: 'balance must be number'});
        AgentCore.updateFinancialBalance(balance);
        res.json({ success: true, stored: balance });
    } catch (e) {
        res.status(500).json({ success:false, error: e.message });
    }
});

app.get('/api/agent/priorities', (req, res) => {
    try {
        ensureInitialIngest();
        const ranked = AgentCore.getPriorities(appData);
        res.json({ success:true, data: ranked });
    } catch (e) {
        res.status(500).json({ success:false, error: e.message });
    }
});

app.get('/api/agent/questions', (req, res) => {
    try {
        const questions = AgentCore.generateQuestions(appData);
        res.json({ success:true, data: questions });
    } catch (e) {
        res.status(500).json({ success:false, error: e.message });
    }
});

app.post('/api/agent/questions/:id/answer', (req, res) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;
        const ok = AgentCore.memory.answerQuestion(id, answer);
        AgentCore.memory.persist();
        res.json({ success: ok, id, answer });
    } catch (e) {
        res.status(500).json({ success:false, error: e.message });
    }
});

app.post('/api/agent/sync/simulate', (req, res) => {
    try {
        const { sources } = req.body || {};
        const stats = AgentCore.runSyncSimulation(sources);
        res.json({ success:true, data: stats });
    } catch (e) {
        res.status(500).json({ success:false, error: e.message });
    }
});

app.get('/api/agent/state', (req, res) => {
    try {
        const snap = AgentCore.stateSnapshot(appData);
        res.json({ success:true, data: snap });
    } catch (e) {
        res.status(500).json({ success:false, error: e.message });
    }
});

// Smart Chat Endpoint - מחובר לסוכן החכם
app.post('/api/chat/smart', async (req, res) => {
    try {
        const { message, context } = req.body;
        
        console.log('📤 שולח לסוכן החכם:', message);
        
        // שליחה לסוכן החכם
        const aiResponse = await axios.post(`${AI_AGENT_URL}/chat`, {
            message: message,
            user_context: context || {}
        });
        
        console.log('📥 תגובה מהסוכן:', aiResponse.data.response);
        
        res.json({
            success: true,
            ...aiResponse.data,
            source: 'smart_agent'
        });
        
    } catch (error) {
        console.error('❌ שגיאה בחיבור לסוכן חכם:', error.message);
        
        // fallback לתגובה בסיסית
        res.json({
            success: true,
            response: "מצטערת, הסוכן החכם לא זמין כרגע. אבל אני כאן לעזור! מה השאלה שלך?",
            task_type: "general",
            source: "fallback",
            error: error.message
        });
    }
});

// Sync API Routes - כפתורי הסנכרון
app.get('/api/sync/academic', async (req, res) => {
    try {
        // סימולציה של נתונים חדשים מהמערכת האקדמית
        const pendingUpdates = [
            {
                id: "academic_1",
                type: "new_task",
                title: "רחל - עבודה במתמטיקה",
                details: {
                    client: "רחל כהן",
                    deadline: "2025-10-05",
                    value: 2800,
                    currency: "₪",
                    description: "עבודה סמינריונית במתמטיקה - סטטיסטיקה"
                },
                action: "approve_new",
                timestamp: "2025-09-25T10:30:00Z"
            },
            {
                id: "academic_2", 
                type: "status_update",
                title: "כרמית - עדכון סטטוס",
                details: {
                    project: "כרמית - סמינר פסיכולוגיה",
                    old_status: "בעבודה",
                    new_status: "הושלם",
                    payment_received: true,
                    amount: 3500
                },
                action: "confirm_completion",
                timestamp: "2025-09-25T09:15:00Z"
            },
            {
                id: "academic_3",
                type: "deadline_change",
                title: "ישראל - דחיית דדליין",
                details: {
                    project: "ישראל - סמינר היסטוריה",
                    old_deadline: "2025-09-28",
                    new_deadline: "2025-10-03",
                    reason: "בקשת הלקוח"
                },
                action: "approve_extension",
                timestamp: "2025-09-25T08:45:00Z"
            }
        ];

        res.json({
            success: true,
            module: "academic",
            pendingUpdates: pendingUpdates,
            count: pendingUpdates.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/sync/bureaucracy', async (req, res) => {
    try {
        const pendingUpdates = [
            {
                id: "bureau_1",
                type: "status_update",
                title: "רישום נישואין - עדכון סטטוס",
                details: {
                    task: "רישום נישואין",
                    authority: "Standesamt Berlin",
                    old_status: "בהמתנה",
                    new_status: "מאושר",
                    next_step: "איסוף תעודה",
                    appointment_date: "2025-10-02"
                },
                action: "confirm_approval",
                timestamp: "2025-09-25T11:00:00Z"
            },
            {
                id: "bureau_2",
                type: "new_requirement",
                title: "TK - מסמך נוסף נדרש",
                details: {
                    task: "ביטוח בריאות - אוריון",
                    authority: "TK",
                    required_document: "אישור הכנסה עדכני",
                    deadline: "2025-09-30",
                    urgency: "גבוה"
                },
                action: "acknowledge_requirement",
                timestamp: "2025-09-25T10:15:00Z"
            },
            {
                id: "bureau_3",
                type: "appointment_available",
                title: "LEA Berlin - תור פנוי",
                details: {
                    task: "בקשת אישור שהייה",
                    authority: "LEA Berlin",
                    appointment_date: "2025-09-28",
                    appointment_time: "14:30",
                    location: "Keplerstraße 2"
                },
                action: "book_appointment",
                timestamp: "2025-09-25T09:30:00Z"
            }
        ];

        res.json({
            success: true,
            module: "bureaucracy", 
            pendingUpdates: pendingUpdates,
            count: pendingUpdates.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/sync/debts', async (req, res) => {
    try {
        const pendingUpdates = [
            {
                id: "debt_1",
                type: "payment_plan_offer",
                title: "PAIR Finance - הצעת תשלומים",
                details: {
                    creditor: "PAIR Finance",
                    company: "Immobilien Scout",
                    case_number: "120203581836",
                    original_amount: 69.52,
                    settlement_offer: 45.00,
                    monthly_payments: 3,
                    payment_amount: 15.00
                },
                action: "review_offer",
                timestamp: "2025-09-25T12:00:00Z"
            },
            {
                id: "debt_2",
                type: "dispute_response",
                title: "coeo Inkasso - תגובה להתנגדות",
                details: {
                    creditor: "coeo Inkasso",
                    company: "Ostrom GmbH", 
                    case_number: "1660002492",
                    dispute_status: "נדחתה",
                    reason: "הוכחות לא מספקות",
                    next_action: "הגשת ערעור או תשלום"
                },
                action: "decide_next_step",
                timestamp: "2025-09-25T11:30:00Z"
            },
            {
                id: "debt_3",
                type: "deadline_warning",
                title: "רשות אכיפה - אזהרה אחרונה",
                details: {
                    creditor: "רשות אכיפה",
                    company: "משרד הבטחון",
                    case_number: "774243-03-25",
                    amount: 7355.17,
                    deadline: "2025-09-30",
                    consequence: "הקפאת חשבונות בנק"
                },
                action: "urgent_payment_arrangement",
                timestamp: "2025-09-25T13:15:00Z"
            }
        ];

        res.json({
            success: true,
            module: "debts",
            pendingUpdates: pendingUpdates,
            count: pendingUpdates.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/sync/emails', async (req, res) => {
    try {
        const pendingUpdates = [
            {
                id: "email_1",
                type: "important_email",
                title: "כרמית - בקשת שינויים",
                details: {
                    from: "karmit.cohen@gmail.com",
                    subject: "שינויים נדרשים בעבודה",
                    received: "2025-09-25T08:30:00Z",
                    priority: "גבוה",
                    content_summary: "בקשה לשינויים קלים בפרק השני",
                    estimated_time: "2 שעות"
                },
                action: "review_changes",
                timestamp: "2025-09-25T08:30:00Z"
            },
            {
                id: "email_2",
                type: "payment_confirmation",
                title: "מרג'ורי - אישור תשלום",
                details: {
                    from: "margori.smith@email.com",
                    subject: "Payment sent for translation work", 
                    received: "2025-09-25T10:00:00Z",
                    amount: 450,
                    currency: "€",
                    payment_method: "PayPal"
                },
                action: "confirm_receipt",
                timestamp: "2025-09-25T10:00:00Z"
            },
            {
                id: "email_3",
                type: "new_inquiry",
                title: "דוד - פנייה חדשה",
                details: {
                    from: "david.levi@university.ac.il",
                    subject: "עבודה במדעי המחשב",
                    received: "2025-09-25T14:00:00Z",
                    project_type: "עבודה סמינריונית",
                    deadline: "2025-10-15",
                    estimated_value: 4000
                },
                action: "respond_to_inquiry",
                timestamp: "2025-09-25T14:00:00Z"
            }
        ];

        res.json({
            success: true,
            module: "emails",
            pendingUpdates: pendingUpdates,
            count: pendingUpdates.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Handle sync actions - טיפול בפעולות אישור/דחיה
app.post('/api/sync/action', async (req, res) => {
    try {
        const { updateId, action, customData } = req.body;
        
        console.log(`🔄 פעולת סנכרון: ${action} על עדכון ${updateId}`);
        
        // כאן נטפל בפעולות שונות
        let result = {};
        
        switch (action) {
            case 'approve_new':
                result = { message: 'המשימה החדשה נוספה בהצלחה', status: 'approved' };
                break;
            case 'confirm_completion':
                result = { message: 'השלמת המשימה אושרה', status: 'completed' };
                break;
            case 'approve_extension':
                result = { message: 'דחיית הדדליין אושרה', status: 'extended' };
                break;
            case 'review_offer':
                result = { message: 'הצעת התשלומים נבדקה', status: 'under_review' };
                break;
            case 'book_appointment':
                result = { message: 'התור נקבע בהצלחה', status: 'booked' };
                break;
            case 'urgent_payment_arrangement':
                result = { message: 'הוגדר תיאום תשלום דחוף', status: 'arranged' };
                break;
            case 'dismiss':
                result = { message: 'העדכון נדחה', status: 'dismissed' };
                break;
            default:
                result = { message: 'פעולה לא מוכרת', status: 'error' };
        }
        
        res.json({
            success: true,
            updateId: updateId,
            action: action,
            result: result,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('שגיאה בפעולת סנכרון:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Basic Chat Endpoint - תגובות מוכנות (גיבוי)
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();
    
    let response = "הבנתי את השאלה שלך. איך אני יכולה לעזור לך בפירוט יותר?";
    
    if (lowerMessage.includes('דחוף') || lowerMessage.includes('היום')) {
        response = "המשימות הדחופות היום:\n• כרמית - סמינר פסיכולוגיה (דדליין היום!)\n• PAIR Finance - התנגדות (נשאר יומיים)\n• ביטוח בריאות TK - הגשת מסמכים\n\nהתחילי עם כרמית - זה הכי דחוף!";
    }
    
    res.json({ 
        success: true, 
        response: response,
        source: "basic_chat"
    });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 מערכת עוזר AI אישית רצה על פורט ${PORT}`);
    console.log(`📊 Dashboard זמין בכתובת: http://localhost:${PORT}`);
    console.log('🔗 AI Agent URL:', AI_AGENT_URL);
});

console.log('שרת פשוט מוכן לעבודה!');