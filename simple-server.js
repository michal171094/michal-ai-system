const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
// Comment out Supabase import for now
// const { getTasks, getDebts, getBureaucracy } = require('./config/supabase');

const app = express();
const PORT = 3000;
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('.'));

// Mock data from your app.js - Full Data
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

// Helper functions for Smart Overview
function processUnifiedTasks(tasks, debts, bureaucracy) {
    const unified = [];
    
    // Process academic tasks
    tasks.forEach(task => {
        unified.push({
            type: 'academic',
            original_id: task.id,
            title: task.project,
            deadline: task.deadline,
            status: task.status,
            priority: task.priority,
            next_action: task.action,
            value_display: `${task.value.toLocaleString()} ${task.currency}`,
            value_eur: convertToEur(task.value, task.currency),
            priority_score: calculatePriorityScore(task.deadline, task.priority, 'academic'),
            priority_level: getPriorityLevel(task.deadline, task.priority)
        });
    });
    
    // Process debts
    debts.forEach(debt => {
        unified.push({
            type: 'debt',
            original_id: debt.id,
            title: `${debt.creditor} - ${debt.company}`,
            deadline: debt.deadline,
            status: debt.status,
            priority: debt.priority,
            next_action: debt.action,
            value_display: `${debt.amount.toLocaleString()} ${debt.currency}`,
            value_eur: convertToEur(debt.amount, debt.currency),
            priority_score: calculatePriorityScore(debt.deadline, debt.priority, 'debt'),
            priority_level: getPriorityLevel(debt.deadline, debt.priority)
        });
    });
    
    // Process bureaucracy
    bureaucracy.forEach(bureau => {
        unified.push({
            type: 'bureaucracy',
            original_id: bureau.id,
            title: `${bureau.task} - ${bureau.authority}`,
            deadline: bureau.deadline,
            status: bureau.status,
            priority: bureau.priority,
            next_action: bureau.action,
            value_display: 'רשמי',
            value_eur: 0,
            priority_score: calculatePriorityScore(bureau.deadline, bureau.priority, 'bureaucracy'),
            priority_level: getPriorityLevel(bureau.deadline, bureau.priority)
        });
    });
    
    // Sort by priority score (highest first)
    return unified.sort((a, b) => b.priority_score - a.priority_score);
}

function calculatePriorityScore(deadline, priority, type) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    // Base score by priority
    let score = 0;
    switch (priority) {
        case 'דחוף': score = 100; break;
        case 'גבוה': score = 80; break;
        case 'בינוני': score = 60; break;
        case 'נמוך': score = 40; break;
        default: score = 50;
    }
    
    // Adjust by deadline urgency
    if (daysUntilDeadline <= 0) score += 50; // Overdue
    else if (daysUntilDeadline <= 2) score += 30; // Very soon
    else if (daysUntilDeadline <= 7) score += 10; // This week
    
    // Adjust by type importance
    switch (type) {
        case 'debt': score += 10; break; // Debts are important
        case 'bureaucracy': score += 5; break; // Official matters
        case 'academic': score += 0; break; // Standard
    }
    
    return Math.min(score, 150); // Cap at 150
}

function getPriorityLevel(deadline, priority) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 0 || priority === 'דחוף') return 'critical';
    if (daysUntilDeadline <= 3 || priority === 'גבוה') return 'urgent';
    if (daysUntilDeadline <= 7 || priority === 'בינוני') return 'pending';
    return 'normal';
}

function convertToEur(amount, currency) {
    const rates = { '₪': 0.25, '€': 1, '$': 0.85 };
    return amount * (rates[currency] || 1);
}

function calculateSmartStatistics(unifiedTasks) {
    const total_tasks = unifiedTasks.length;
    const critical_count = unifiedTasks.filter(t => t.priority_level === 'critical').length;
    const urgent_count = unifiedTasks.filter(t => t.priority_level === 'urgent').length;
    const pending_count = unifiedTasks.filter(t => t.priority_level === 'pending').length;
    
    const total_value = unifiedTasks.reduce((sum, task) => {
        return sum + (task.value_eur * 3.8); // Convert EUR to ILS for display
    }, 0);
    
    const average_priority_score = unifiedTasks.length > 0 
        ? unifiedTasks.reduce((sum, task) => sum + task.priority_score, 0) / unifiedTasks.length 
        : 0;
    
    return {
        total_tasks,
        critical_count,
        urgent_count,
        pending_count,
        total_value: Math.round(total_value),
        average_priority_score
    };
}

// Smart Overview API endpoint
app.get('/api/smart-overview', async (req, res) => {
    try {
        // Use the existing appData for now (later we'll fetch from database)
        const tasks = appData.tasks || [];
        const debts = appData.debts || [];
        const bureaucracy = appData.bureaucracy || [];

        // Process and unify the data with AI prioritization
        const unifiedTasks = processUnifiedTasks(tasks, debts, bureaucracy);
        
        // Calculate statistics
        const statistics = calculateSmartStatistics(unifiedTasks);
        
        res.json({
            unified_tasks: unifiedTasks,
            statistics: statistics,
            last_updated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Smart overview error:', error);
        res.status(500).json({ error: 'Failed to fetch smart overview' });
    }
});

// API Routes - עכשיו עם Supabase
app.get('/api/tasks', async (req, res) => {
    try {
        // Return appData tasks for now
        res.json({ success: true, data: appData.tasks });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/debts', async (req, res) => {
    try {
        // Return appData debts for now
        res.json({ success: true, data: appData.debts });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/bureaucracy', async (req, res) => {
    try {
        // Return appData bureaucracy for now
        res.json({ success: true, data: appData.bureaucracy });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/debts', async (req, res) => {
    try {
        const { data, error } = await getDebts();
        if (error) {
            console.error('שגיאה בטעינת חובות:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
        res.json({ success: true, data });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/bureaucracy', async (req, res) => {
    try {
        const { data, error } = await getBureaucracy();
        if (error) {
            console.error('שגיאה בטעינת בירוקרטיה:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
        res.json({ success: true, data });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Smart Chat with AI Agent - הודעות לסוכן החכם
app.post('/api/smart-chat', async (req, res) => {
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

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 מערכת עוזר AI אישית רצה על פורט 3000');
    console.log('📊 Dashboard זמין בכתובת: http://localhost:3000');
});

console.log('שרת פשוט מוכן לעבודה!');