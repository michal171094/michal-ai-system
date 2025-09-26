const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('.'));

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

// ===== TASK MANAGEMENT ENDPOINTS =====

// Create new task
app.post('/api/tasks', (req, res) => {
    try {
        const task = req.body;
        task.id = Date.now() + Math.random();
        task.created = new Date().toISOString();
        appData.tasks.push(task);
        
        console.log('✅ New task created:', task.title);
        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Bulk task creation
app.post('/api/tasks/bulk', (req, res) => {
    try {
        const { tasks } = req.body;
        if (!Array.isArray(tasks)) {
            return res.status(400).json({ success: false, error: 'tasks must be an array' });
        }
        
        const createdTasks = [];
        tasks.forEach(taskData => {
            const t = { 
                ...taskData, 
                id: Date.now() + Math.random(),
                created: new Date().toISOString()
            };
            appData.tasks.push(t);
            createdTasks.push(t);
        });
        
        console.log(`✅ Bulk created ${createdTasks.length} tasks`);
        res.json({ 
            success: true, 
            created: createdTasks.length, 
            data: createdTasks 
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

// Delete all tasks
app.delete('/api/tasks', (req, res) => {
    const deletedCount = appData.tasks.length;
    appData.tasks = [];
    console.log(`🗑️ Deleted ${deletedCount} tasks`);
    res.json({ success: true, deleted: deletedCount });
});

// Create debt
app.post('/api/debts', (req, res) => {
    try {
        const debt = req.body;
        debt.id = Date.now() + Math.random();
        debt.created = new Date().toISOString();
        appData.debts.push(debt);
        
        console.log('✅ New debt created:', debt.title);
        res.json({ success: true, data: debt });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete all debts
app.delete('/api/debts', (req, res) => {
    const deletedCount = appData.debts.length;
    appData.debts = [];
    console.log(`🗑️ Deleted ${deletedCount} debts`);
    res.json({ success: true, deleted: deletedCount });
});

// Create bureaucracy item
app.post('/api/bureaucracy', (req, res) => {
    try {
        const item = req.body;
        item.id = Date.now() + Math.random();
        item.created = new Date().toISOString();
        appData.bureaucracy.push(item);
        
        console.log('✅ New bureaucracy item created:', item.title);
        res.json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete all bureaucracy items
app.delete('/api/bureaucracy', (req, res) => {
    const deletedCount = appData.bureaucracy.length;
    appData.bureaucracy = [];
    console.log(`🗑️ Deleted ${deletedCount} bureaucracy items`);
    res.json({ success: true, deleted: deletedCount });
});

// ===== GMAIL ENDPOINTS =====

// Gmail status
app.get('/api/gmail/status', (req, res) => {
    res.json({
        configured: !!process.env.GOOGLE_CLIENT_ID,
        authenticated: false, // Would need real OAuth flow
        accounts: [],
        activeEmail: null
    });
});

// Gmail sync endpoint
app.post('/api/gmail/sync', async (req, res) => {
    console.log('📧 Gmail sync requested...');
    
    // Simulate email processing
    try {
        // For now, we'll simulate finding some emails
        const mockEmails = [
            {
                id: 'email-1',
                subject: 'PAIR Finance - Urgent Payment Required',
                from: 'collections@pairfinance.com',
                date: new Date().toISOString(),
                snippet: 'נדרש תשלום דחוף לחוב...',
                priority: 'high'
            },
            {
                id: 'email-2', 
                subject: 'TK Health Insurance - Documents Required',
                from: 'service@tk.de',
                date: new Date().toISOString(),
                snippet: 'נדרשים מסמכים נוספים...',
                priority: 'medium'
            }
        ];
        
        // Add to app data
        if (!appData.emails) appData.emails = [];
        
        let newCount = 0;
        mockEmails.forEach(email => {
            const exists = appData.emails.find(e => e.id === email.id);
            if (!exists) {
                appData.emails.push(email);
                newCount++;
            }
        });
        
        console.log(`📧 Gmail sync: ${newCount} new emails found`);
        
        res.json({
            success: true,
            ingested: newCount,
            total: appData.emails.length,
            message: newCount > 0 ? `נמצאו ${newCount} מיילים חדשים` : 'לא נמצאו מיילים חדשים'
        });
        
    } catch (error) {
        console.error('Gmail sync error:', error);
        res.status(500).json({
            success: false,
            error: 'שגיאה בסנכרון מיילים: ' + error.message
        });
    }
});

// Gmail auth URL (mock)
app.get('/api/gmail/auth-url', (req, res) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return res.status(503).json({
            error: 'Gmail OAuth לא מוגדר - נדרש GOOGLE_CLIENT_ID'
        });
    }
    
    // Mock auth URL
    const authUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'https://michal-ai-system.onrender.com/auth/google/callback')}&scope=https://www.googleapis.com/auth/gmail.readonly&response_type=code`;
    
    res.json({ url: authUrl });
});

// Connectors status
app.get('/api/connectors/status', (req, res) => {
    res.json({
        success: true,
        data: {
            gmail: {
                configured: !!process.env.GOOGLE_CLIENT_ID,
                accounts: [],
                activeEmail: null,
                authenticated: false
            }
        }
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