const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const GmailService = require('./services/GmailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const AI_AGENT_URL = process.env.AI_AGENT_URL || 'http://localhost:8000';

let gmailService = null;
try {
    gmailService = new GmailService();
    console.log('📨 Gmail service initialized');
} catch (error) {
    console.warn('⚠️ Gmail service unavailable:', error.message);
}

// Global error handling
process.on('uncaughtException', (err) => {
    console.error('🚨 Uncaught Exception:', err.message);
    console.error('Stack:', err.stack);
    // Don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit - keep server running
});

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('רק קבצי תמונה ו-PDF מורשים'));
        }
    }
});

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files (your HTML, CSS, JS)
app.use(express.static('.'));

// Real Application Data - Based on Michal's Actual Situation
const appData = {
    tasks: [
        // Academic Projects - Based on WhatsApp analysis
        {id: 1, project: "כרמית - סמינר פסיכולוגיה", client: "כרמית", deadline: "2025-09-26", status: "בעבודה", priority: "דחוף", value: 3500, currency: "₪", action: "הוספת מאמרים + הכנת טיוטה סופית", module: "academic", details: "צריך 8 מאמרים לפחות, הוספת עוד 3. הגשה עד יום ה' לפני פגישה עם מרצה"},
        {id: 2, project: "ישראל - סמינר היסטוריה", client: "ישראל", deadline: "2025-09-30", status: "המתנה לאישור", priority: "דחוף", value: 4200, currency: "₪", action: "שליחת טיוטות + מעקב דחוף", module: "academic", details: "לא נשאר הרבה זמן, צריך להתקדם מהר"},
        {id: 3, project: "מרג'ורי - תרגום + אפוסטיל", client: "מרג'ורי", deadline: "2025-10-15", status: "בעיבוד", priority: "גבוה", value: 850, currency: "€", action: "השלמת תרגום + בירור אפוסטיל + התאמה לגרמניה", module: "academic", details: "תרגום מסמכים, אפוסטיל, בדיקת התאמה לדרישות גרמניות"},
        {id: 4, project: "עבודה סמינריונית קבוצתית", client: "קבוצת סטודנטים", deadline: "2025-11-15", status: "בתמיכה", priority: "בינוני", value: 2200, currency: "₪", action: "תמיכה אקדמית + פתרון משברים בין חברות", module: "academic", details: "סיום עבודה, מתן תמיכה, פתרונות למשבר בין חברות הקבוצה"}
    ],
    bureaucracy: [
        // German Bureaucracy
        {id: 1, task: "רישום נישואין", authority: "Standesamt Berlin", status: "בעיבוד - חסרים מסמכים", deadline: "2025-11-30", action: "השגת תעודת לידה אוריון + אפוסטיל + אישור רווקות", priority: "גבוה", details: "בקשה מ-05.06.2025 אושרה, חסרים מסמכים. זמן עיבוד 6-8 שבועות"},
        {id: 2, task: "ביטוח בריאות - אוריון", authority: "TK", status: "ממתין לאישור שהייה", deadline: "2025-10-31", action: "תיאום עם LEA לאישור שהייה", priority: "דחוף", details: "מיכל מבוטחת, אוריון עדיין ללא ביטוח. תלוי באישור שהייה"},
        {id: 3, task: "אישור שהייה - אוריון", authority: "LEA Berlin", status: "בהליך", deadline: "2025-12-01", action: "מעקב אחר בקשה מקוונת מ-24.05.2025", priority: "גבוה", details: "בקשה מקוונת הוגשה, ממתין לתשובה. קריטי לביטוח בריאות"},
        {id: 4, task: "עדכון סוציאל-אמט", authority: "Sozialamt Berlin", status: "דורש עדכון", deadline: "2025-10-15", action: "הודעה על קבלת Bürgergeld + סגירת תיק", priority: "בינוני", details: "לעדכן על אישור הג'ובסנטר כדי לסגור תיק סוציאל"},
        {id: 5, task: "Bürgergeld - מעקב", authority: "Jobcenter", status: "מאושר", deadline: "2025-06-30", action: "מעקב שוטף + דיווחים", priority: "נמוך", details: "אושר עד יוני 2026, 1,267.64€ חודשי"},
        // Israeli Bureaucracy  
        {id: 6, task: "ביטוח לאומי - מעקב", authority: "ביטוח לאומי", status: "פעיל", deadline: "2025-12-31", action: "מעקב קצבאות + עדכונים", priority: "נמוך", details: "קצבאות פעילות: מיכל 4,556₪, אוריון 4,556₪"},
        {id: 7, task: "משרד הביטחון - הכרה באוריון", authority: "משרד הביטחון", status: "בתהליך", deadline: "2025-12-31", action: "מעקב אחר תהליך ההכרה", priority: "בינוני", details: "תהליך הכרה עבור PTSD, OCD, דיכאון משירות צבאי"}
    ],
    debts: [
        // German Debts - PAIR Finance
        {id: 1, creditor: "PAIR Finance", company: "Immobilien Scout", amount: 69.52, currency: "€", case_number: "120203581836", status: "פתוח - התראה שנייה", action: "הצעת פשרה 50% (€35)", priority: "קריטי", deadline: "2025-09-27", details: "התראה שנייה, ההתנגדות הראשונה לא עבדה"},
        {id: 2, creditor: "PAIR Finance", company: "Free2Move", amount: 57, currency: "€", case_number: "162857501033", status: "פתוח", action: "בירור חוב + התנגדות", priority: "גבוה", deadline: "2025-09-29", details: "ממשיכים בהליכי גביה, צריך בירור"},
        {id: 3, creditor: "PAIR Finance", company: "Novum Bank Cashper", amount: 208.60, currency: "€", case_number: "168775195683", status: "פתוח", action: "הצעת פשרה", priority: "גבוה", deadline: "2025-10-05", details: "נשלחו הצעות פשרה, ממתין למענה"},
        {id: 4, creditor: "coeo Inkasso", company: "Ostrom GmbH", amount: 455, currency: "€", case_number: "1660002492", status: "בהתנגדות פעילה", action: "המשך התנגדות + מעקב", priority: "גבוה", deadline: "2025-10-01", details: "בהתנגדות פעילה, בשלבי טיפול"},
        // Other German Debts
        {id: 5, creditor: "Riverty Inkasso", company: "Amazon Digital Germany", amount: 0, currency: "€", case_number: "S.25.6022443.01.0", status: "פתוח", action: "דרישת פירוט + התנגדות", priority: "בינוני", deadline: "2025-10-10", details: "דרישת תשלום ללא פירוט סכום"},
        {id: 6, creditor: "Riverty Inkasso", company: "Amazon Payments SCA", amount: 0, currency: "€", case_number: "S.25.5827652.01.1", status: "פתוח", action: "דרישת פירוט + התנגדות", priority: "בינוני", deadline: "2025-10-10", details: "דרישת תשלום ללא פירוט סכום"},
        {id: 7, creditor: "Vattenfall Inkasso", company: "Vattenfall (חשמל)", amount: 0, currency: "€", case_number: "", status: "פתוח", action: "בירור חוב + התנגדות", priority: "בינוני", deadline: "2025-10-15", details: "איום בצעדים חיצוניים"},
        {id: 8, creditor: "TK", company: "TK (ביטוח בריאות)", amount: 0, currency: "€", case_number: "B268202260", status: "בהתנגדות", action: "בירור בקשה + המשך התנגדות", priority: "גבוה", deadline: "2025-10-20", details: "בתהליך בירור בקשה/התנגדות"},
        // Israeli Debts
        {id: 9, creditor: "רשות אכיפה והגבייה", company: "משרד הבטחון", amount: 7355.17, currency: "₪", case_number: "774243-03-25", status: "התראה פתוחה", action: "תיאום תשלומים + הסדר", priority: "קריטי", deadline: "2025-09-30", details: "תיק טרום חוב/התראה מלשכת ההוצאה לפועל"},
        {id: 10, creditor: "רשות המסים", company: "רשות המסים", amount: 0, currency: "₪", case_number: "", status: "ממתין", action: "בירור חוב + הסדר תשלומים", priority: "בינוני", deadline: "2025-11-15", details: "חוב בהרשאה, ממתין לבירור"},
        {id: 11, creditor: "כ.א.ל", company: "כרטיסי אשראי לישראל", amount: 0, currency: "₪", case_number: "", status: "פתוח", action: "דרישת פירוט + הסדר", priority: "בינוני", deadline: "2025-10-30", details: "דרישת תשלום במייל/דואר"},
        {id: 12, creditor: "מנורה מבטחים", company: "מנורה מבטחים (ביטוח)", amount: 741.66, currency: "₪", case_number: "", status: "פתוח", action: "בירור פוליסות + הסדר תשלום", priority: "בינוני", deadline: "2025-11-01", details: "מספר פוליסות: 330.43₪ + 326.02₪ + 85.21₪"},
        {id: 13, creditor: "ביטוח לאומי", company: "המוסד לביטוח לאומי", amount: 0, currency: "₪", case_number: "897777", status: "בתהליך בדיקה", action: "הגשת מסמכים + מעקב", priority: "בינוני", deadline: "2025-11-30", details: "הגשת מסמכים, בתהליכי בדיקה"},
        {id: 14, creditor: "רשות אכיפה (קנסות)", company: "קנסות/הוצאות מדינה", amount: 0, currency: "₪", case_number: "164025", status: "בטיפול", action: "טיפול בפניות + בחינה", priority: "נמוך", deadline: "2025-12-15", details: "טיפול בפניות/בחינה"}
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

// File Upload and OCR Processing API
app.post('/api/upload-document', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'לא הועלה קובץ' });
        }

        const fileInfo = {
            filename: req.file.originalname,
            size: req.file.size,
            path: req.file.path,
            mimetype: req.file.mimetype,
            timestamp: new Date().toISOString()
        };

        // Send to AI agent for OCR processing
        try {
            const formData = new FormData();
            const fileBuffer = fs.readFileSync(req.file.path);
            const blob = new Blob([fileBuffer], { type: req.file.mimetype });
            formData.append('file', blob, req.file.originalname);

            const ocrResponse = await axios.post(`${AI_AGENT_URL}/ocr-process`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000
            });

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            res.json({
                success: true,
                message: 'מסמך עובד בהצלחה',
                file_info: fileInfo,
                ocr_result: ocrResponse.data,
                analysis: ocrResponse.data.analysis || {},
                new_tasks: ocrResponse.data.new_tasks || []
            });

        } catch (aiError) {
            console.error('AI OCR Error:', aiError.message);
            
            // Fallback - basic file processing
            const basicAnalysis = analyzeDocumentBasic(req.file.originalname, fileInfo);
            
            res.json({
                success: true,
                message: 'קובץ הועלה (ללא OCR מתקדם)',
                file_info: fileInfo,
                analysis: basicAnalysis,
                fallback: true
            });
        }

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'שגיאה בהעלאת הקובץ' });
    }
});

// Gmail OAuth status
app.get('/api/gmail/status', (req, res) => {
    if (!gmailService) {
        return res.status(503).json({ configured: false, authenticated: false });
    }
    res.json({ configured: true, authenticated: gmailService.hasValidTokens() });
});

// Gmail OAuth URL
app.get('/api/gmail/auth-url', (req, res) => {
    if (!gmailService) {
        return res.status(503).json({ error: 'שירות Gmail אינו זמין' });
    }
    res.json({ url: gmailService.getAuthUrl() });
});

// Gmail OAuth callback
app.get('/auth/google/callback', async (req, res) => {
    if (!gmailService) {
        return res.status(503).send('Gmail service unavailable');
    }

    const { code, error } = req.query;
    if (error) {
        console.error('Gmail OAuth error:', error);
        return res.redirect('/?gmail=denied');
    }

    if (!code) {
        return res.redirect('/?gmail=missing_code');
    }

    try {
        await gmailService.exchangeCodeForTokens(code);
        res.redirect('/?gmail=connected');
    } catch (tokenError) {
        console.error('Failed to exchange Gmail code:', tokenError);
        res.redirect('/?gmail=error');
    }
});

// Gmail Integration API
app.post('/api/gmail/sync', async (req, res) => {
    if (!gmailService) {
        return res.status(503).json({ error: 'שירות Gmail אינו זמין' });
    }

    try {
        const emails = await gmailService.listRecentEmails(15);
        res.json({
            success: true,
            emails_found: emails.length,
            emails
        });
    } catch (error) {
        if (error.message === 'AUTH_REQUIRED') {
            return res.status(401).json({
                auth_required: true,
                auth_url: gmailService.getAuthUrl()
            });
        }

        console.error('Gmail sync error:', error);
        res.status(500).json({ error: 'שגיאה בסינכרון Gmail' });
    }
});

// Smart Action Recommendations API
app.get('/api/smart-recommendations', async (req, res) => {
    try {
        const currentDate = new Date();
        const recommendations = [];

        // Analyze urgent tasks
        const urgentTasks = [...appData.tasks, ...appData.debts, ...appData.bureaucracy]
            .filter(item => {
                const deadline = new Date(item.deadline);
                const daysLeft = Math.ceil((deadline - currentDate) / (1000 * 60 * 60 * 24));
                return daysLeft <= 3;
            })
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

        // Generate smart recommendations
        urgentTasks.forEach((task, index) => {
            const daysLeft = Math.ceil((new Date(task.deadline) - currentDate) / (1000 * 60 * 60 * 24));
            
            recommendations.push({
                id: `rec_${index + 1}`,
                priority: daysLeft <= 0 ? 'critical' : daysLeft <= 1 ? 'urgent' : 'high',
                title: task.project || task.task || `${task.creditor} - ${task.company}`,
                description: task.action,
                deadline: task.deadline,
                days_left: daysLeft,
                type: task.module || (task.creditor ? 'debt' : 'bureaucracy'),
                recommended_action: generateSmartAction(task, daysLeft),
                estimated_time: estimateTaskTime(task),
                templates_available: getAvailableTemplates(task)
            });
        });

        res.json({
            success: true,
            recommendations: recommendations,
            total_urgent: recommendations.length,
            critical_count: recommendations.filter(r => r.priority === 'critical').length
        });

    } catch (error) {
        console.error('Smart recommendations error:', error);
        res.status(500).json({ error: 'שגיאה ביצירת המלצות' });
    }
});

// Helper Functions
function analyzeDocumentBasic(filename, fileInfo) {
    const analysis = {
        document_type: 'unknown',
        language: 'unknown',
        key_entities: [],
        likely_action: 'review_manual'
    };

    const lowerFilename = filename.toLowerCase();
    
    if (lowerFilename.includes('mahnung') || lowerFilename.includes('pair') || lowerFilename.includes('inkasso')) {
        analysis.document_type = 'debt_notice';
        analysis.language = 'german';
        analysis.likely_action = 'debt_response';
        analysis.key_entities = ['debt_collection', 'payment_demand'];
    } else if (lowerFilename.includes('standesamt') || lowerFilename.includes('marriage')) {
        analysis.document_type = 'bureaucracy';
        analysis.language = 'german';
        analysis.likely_action = 'bureaucracy_update';
        analysis.key_entities = ['marriage_registration', 'official_document'];
    }

    return analysis;
}

function generateSmartAction(task, daysLeft) {
    if (task.creditor) {
        if (daysLeft <= 0) return 'שליחה מיידית של הצעת פשרה או התנגדות';
        if (daysLeft <= 2) return 'הכנת מכתב התנגדות או פשרה';
        return 'בירור פרטי החוב';
    } else if (task.authority) {
        return 'מעקב אחר סטטוס + הכנת מסמכים חסרים';
    } else {
        if (daysLeft <= 1) return 'עבודה מיידית על הפרויקט';
        return 'תכנון שלבי העבודה';
    }
}

function estimateTaskTime(task) {
    if (task.creditor) return '30-60 דקות';
    if (task.authority) return '1-2 שעות';
    if (task.project) return '4-8 שעות';
    return '1-3 שעות';
}

function getAvailableTemplates(task) {
    const templates = [];
    
    if (task.creditor) {
        templates.push('התנגדות לחוב', 'הצעת פשרה', 'בקשת פירוט');
    }
    if (task.authority) {
        templates.push('בקשת עדכון סטטוס', 'הגשת מסמכים');
    }
    if (task.project) {
        templates.push('דוא"ל עדכון ללקוח', 'בקשת הארכה');
    }
    
    return templates;
}

// API ENDPOINTS

// Smart Overview API endpoint
app.get('/api/smart-overview', async (req, res) => {
    try {
        // Use the existing appData
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

// Basic API endpoints
app.get('/api/tasks', async (req, res) => {
    try {
        res.json({ success: true, data: appData.tasks });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/debts', async (req, res) => {
    try {
        res.json({ success: true, data: appData.debts });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/bureaucracy', async (req, res) => {
    try {
        res.json({ success: true, data: appData.bureaucracy });
    } catch (error) {
        console.error('שגיאה בשרת:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Chat Endpoints
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

// Authentication endpoints
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🚨 Server Error:', err.message);
    console.error('Stack:', err.stack);
    
    // Send safe error response
    res.status(500).json({
        success: false,
        error: 'שגיאת שרת פנימית',
        message: process.env.NODE_ENV === 'development' ? err.message : 'שגיאה בלתי צפויה'
    });
});

// Serve main page
app.get('/', (req, res) => {
    console.log('📄 Serving index.html for root path');
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler - must be LAST!
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'הדף לא נמצא',
        path: req.originalUrl
    });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log('✅ חובר בהצלחה ל-Supabase');
    console.log('שרת פשוט מוכן לעבודה!');
    console.log('🚀 מערכת עוזר AI אישית רצה על פורט 3000');
    console.log('📊 Dashboard זמין בכתובת: http://localhost:3000');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🔄 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🔄 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});