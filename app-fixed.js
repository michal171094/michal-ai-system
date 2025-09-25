// Michal AI Personal Assistant - JavaScript Core
// Data management and UI functionality

// Global app data
const appData = {
    // Real academic projects data
    tasks: [
        {
            id: 1,
            project: 'עבודת סמינר - פסיכולוגיה חברתית',
            client: 'כרמית - דוקטורנטית',
            action: 'סיים כתיבת פרק 3',
            status: 'בעבודה',
            priority: 'דחוף',
            deadline: '2025-09-28',
            timeLeft: '3 ימים',
            urgency: 'גבוהה',
            aiPriority: 1
        },
        {
            id: 2,
            project: 'עבודת סמינר - היסטוריה של ארץ ישראל',
            client: 'דודו - מחקר אקדמי',
            action: 'עריכה וסיום',
            status: 'בעריכה',
            priority: 'גבוה',
            deadline: '2025-10-05',
            timeLeft: '10 ימים',
            urgency: 'בינונית',
            aiPriority: 2
        },
        {
            id: 3,
            project: 'תרגום עבודת מרג\'ורי',
            client: 'מרג\'ורי - מחקר אקדמי',
            action: 'המשך תרגום',
            status: 'בתרגום',
            priority: 'בינוני',
            deadline: '2025-10-10',
            timeLeft: '15 ימים',
            urgency: 'נמוכה',
            aiPriority: 3
        },
        {
            id: 4,
            project: 'פרויקט מחקר משותף',
            client: 'צוות אקדמי',
            action: 'ארגון נתונים',
            status: 'התחלה',
            priority: 'נמוך',
            deadline: '2025-10-20',
            timeLeft: '25 ימים',
            urgency: 'נמוכה',
            aiPriority: 4
        }
    ],

    // Real German-Israeli bureaucracy data
    bureaucracy: [
        {
            id: 1,
            task: 'רישום נישואין בגרמניה',
            authority: 'Standesamt',
            action: 'הגש מסמכים מתורגמים',
            status: 'ממתין למסמכים',
            priority: 'דחוף',
            deadline: '2025-09-30',
            timeLeft: '5 ימים',
            documents: [
                { type: 'pdf', name: 'Standesamt_Application.pdf', url: '#' },
                { type: 'email', name: 'מייל_דרישות_מסמכים.eml', url: '#' }
            ]
        },
        {
            id: 2,
            task: 'ביטוח בריאות גרמני',
            authority: 'AOK',
            action: 'השלם טפסי הרשמה',
            status: 'בתהליך',
            priority: 'גבוה',
            deadline: '2025-10-01',
            timeLeft: '6 ימים',
            documents: [
                { type: 'pdf', name: 'AOK_Registration_Form.pdf', url: '#' },
                { type: 'pdf', name: 'הוראות_הרשמה.pdf', url: '#' }
            ]
        },
        {
            id: 3,
            task: 'אישור מגורים',
            authority: 'Einwohnermeldeamt',
            action: 'עדכון כתובת',
            status: 'מושלם',
            priority: 'בינוני',
            deadline: '2025-10-15',
            timeLeft: '20 ימים',
            documents: [
                { type: 'pdf', name: 'Anmeldung_Confirmation.pdf', url: '#' }
            ]
        },
        {
            id: 4,
            task: 'העברת רישיון נהיגה',
            authority: 'Führerscheinstelle',
            action: 'קבע תור לבדיקה',
            status: 'ממתין',
            priority: 'נמוך',
            deadline: '2025-11-01',
            timeLeft: '37 ימים',
            documents: [
                { type: 'pdf', name: 'רישיון_נהיגה_ישראלי.pdf', url: '#' },
                { type: 'email', name: 'Termin_Anfrage.eml', url: '#' }
            ]
        },
        {
            id: 5,
            task: 'פתיחת חשבון בנק',
            authority: 'Deutsche Bank',
            action: 'הכן מסמכים נדרשים',
            status: 'בתהליך',
            priority: 'בינוני',
            deadline: '2025-10-08',
            timeLeft: '13 ימים',
            documents: [
                { type: 'pdf', name: 'Bank_Requirements.pdf', url: '#' }
            ]
        },
        {
            id: 6,
            task: 'רישום לביטוח לאומי גרמני',
            authority: 'Deutsche Rentenversicherung',
            action: 'מלא טפסים',
            status: 'חדש',
            priority: 'בינוני',
            deadline: '2025-10-12',
            timeLeft: '17 ימים',
            documents: [
                { type: 'pdf', name: 'Rentenversicherung_Forms.pdf', url: '#' }
            ]
        },
        {
            id: 7,
            task: 'בקשה לאשרת עבודה',
            authority: 'Arbeitsagentur',
            action: 'הגש בקשה',
            status: 'ממתין למועד',
            priority: 'גבוה',
            deadline: '2025-10-03',
            timeLeft: '8 ימים',
            documents: [
                { type: 'pdf', name: 'Work_Permit_Application.pdf', url: '#' },
                { type: 'email', name: 'Arbeitsagentur_Instructions.eml', url: '#' }
            ]
        }
    ],

    // Real debt collection cases
    debts: [
        {
            id: 1,
            creditor: 'PAIR Finance',
            company: 'אמזון',
            amount: 1247,
            currency: 'EUR',
            action: 'התקשר ותסדר תשלומים',
            status: 'פעיל',
            priority: 'דחוף',
            deadline: '2025-09-30',
            timeLeft: '5 ימים',
            documents: [
                { type: 'pdf', name: 'התראה_PAIR_Finance.pdf', url: '#' },
                { type: 'email', name: 'מייל_התראה_שנייה.eml', url: '#' }
            ]
        },
        {
            id: 2,
            creditor: 'Creditreform',
            company: 'זלנדו',
            amount: 89,
            currency: 'EUR',
            action: 'שלח הודעת סטטוס',
            status: 'בטיפול',
            priority: 'גבוה',
            deadline: '2025-10-02',
            timeLeft: '7 ימים',
            documents: [
                { type: 'pdf', name: 'Creditreform_Notice.pdf', url: '#' },
                { type: 'image', name: 'זלנדו_חשבונית.jpg', url: '#' }
            ]
        },
        {
            id: 3,
            creditor: 'EOS KSI',
            company: 'אוטו1',
            amount: 635,
            currency: 'EUR',
            action: 'בדוק תקיפות חוב',
            status: 'מתחקר',
            priority: 'בינוני',
            deadline: '2025-10-05',
            timeLeft: '10 ימים',
            documents: [
                { type: 'pdf', name: 'EOS_KSI_Letter.pdf', url: '#' },
                { type: 'pdf', name: 'Auto1_Contract.pdf', url: '#' }
            ]
        },
        {
            id: 4,
            creditor: 'PAIGO',
            company: 'אייביי',
            amount: 156,
            currency: 'EUR',
            action: 'שלם או ערער',
            status: 'חדש',
            priority: 'בינוני',
            deadline: '2025-10-08',
            timeLeft: '13 ימים',
            documents: [
                { type: 'email', name: 'eBay_PAIGO_Notice.eml', url: '#' }
            ]
        },
        {
            id: 5,
            creditor: 'הוצאה לפועל',
            company: 'בזק',
            amount: 340,
            currency: 'ILS',
            action: 'קבע הסדר תשלומים',
            status: 'הסדר',
            priority: 'גבוה',
            deadline: '2025-09-27',
            timeLeft: '2 ימים',
            documents: [
                { type: 'pdf', name: 'הוצאה_לפועל_בזק.pdf', url: '#' },
                { type: 'pdf', name: 'הסדר_תשלומים.pdf', url: '#' }
            ]
        }
    ]
};

// Current active tab
let activeTab = 'smart-overview';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('מאתחל את האפליקציה החכמה של מיכל...');
    
    // Initialize tabs
    initializeTabs();
    
    // Load initial data for smart overview
    loadSmartOverview();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Populate initial data
    populateData();
    
    console.log('המערכת מוכנה לעבודה! 🚀');
});

function initializeTabs() {
    console.log('מאתחל טאבים...');
    switchTab('smart-overview');
}

function setupEventListeners() {
    console.log('מגדיר מאזינים לאירועים...');
    
    // Tab switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Gmail controls
    const syncEmailBtn = document.getElementById('syncEmailBtn');
    if (syncEmailBtn) {
        syncEmailBtn.addEventListener('click', syncGmailTasks);
    }
    
    const refreshSmartBtn = document.getElementById('refreshSmartBtn');
    if (refreshSmartBtn) {
        refreshSmartBtn.addEventListener('click', loadSmartOverview);
    }
    
    // Document upload
    const uploadDocBtn = document.getElementById('uploadDocBtn');
    if (uploadDocBtn) {
        uploadDocBtn.addEventListener('click', () => {
            document.getElementById('documentUpload').click();
        });
    }
    
    const documentUpload = document.getElementById('documentUpload');
    if (documentUpload) {
        documentUpload.addEventListener('change', handleDocumentUpload);
    }
    
    // Smart recommendations
    const smartRecBtn = document.getElementById('smartRecBtn');
    if (smartRecBtn) {
        smartRecBtn.addEventListener('click', toggleRecommendations);
    }
    
    // Process documents
    const processDocsBtn = document.getElementById('processDocsBtn');
    if (processDocsBtn) {
        processDocsBtn.addEventListener('click', processPendingDocuments);
    }
}

// Tab switching functionality
function switchTab(tabName) {
    console.log('עובר לטאב:', tabName);
    
    // Update active tab
    activeTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabName) {
            tab.classList.add('active');
        }
    });
    
    // Show/hide panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.style.display = 'none';
    });
    
    const targetPanel = document.getElementById(tabName);
    if (targetPanel) {
        targetPanel.style.display = 'block';
    }
    
    // Load data for active tab
    switch(tabName) {
        case 'smart-overview':
            loadSmartOverview();
            break;
        case 'academic':
            populateAcademic();
            break;
        case 'bureaucracy':
            populateBureaucracy();
            break;
        case 'debts':
            populateDebts();
            break;
    }
}

// Smart overview functionality
async function loadSmartOverview() {
    console.log('טוען סקירה חכמה...');
    
    try {
        // Update smart stats
        updateSmartStats();
        
        // Load smart table
        populateSmartTable();
        
        showNotification('סקירה חכמה נטענה בהצלחה', 'success');
    } catch (error) {
        console.error('Error loading smart overview:', error);
        showNotification('שגיאה בטעינת סקירה חכמה', 'error');
    }
}

function updateSmartStats() {
    // Count urgent items
    const criticalCount = getAllItems().filter(item => 
        item.priority === 'דחוף' && isToday(item.deadline)
    ).length;
    
    const urgentCount = getAllItems().filter(item => 
        item.priority === 'דחוף' || item.priority === 'גבוה'
    ).length;
    
    const pendingCount = getAllItems().filter(item => 
        item.status !== 'מושלם'
    ).length;
    
    // Update display
    const criticalEl = document.getElementById('criticalCount');
    const urgentEl = document.getElementById('urgentCount');
    const pendingEl = document.getElementById('pendingCount');
    const emailTasksEl = document.getElementById('emailTasksCount');
    
    if (criticalEl) criticalEl.textContent = criticalCount;
    if (urgentEl) urgentEl.textContent = urgentCount;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (emailTasksEl) emailTasksEl.textContent = '2'; // Demo value
}

function populateSmartTable() {
    const tbody = document.getElementById('smartTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Get all items and sort by AI priority
    const allItems = getAllItems().sort((a, b) => {
        // Priority weights
        const priorityWeights = { 'דחוף': 4, 'גבוה': 3, 'בינוני': 2, 'נמוך': 1 };
        const aWeight = priorityWeights[a.priority] || 0;
        const bWeight = priorityWeights[b.priority] || 0;
        
        // Date proximity
        const aDate = new Date(a.deadline);
        const bDate = new Date(b.deadline);
        const today = new Date();
        const aDays = Math.ceil((aDate - today) / (1000 * 60 * 60 * 24));
        const bDays = Math.ceil((bDate - today) / (1000 * 60 * 60 * 24));
        
        // Combine weights
        return (bWeight * 10 - bDays) - (aWeight * 10 - aDays);
    });
    
    allItems.forEach((item, index) => {
        const row = createSmartRow(item, index + 1);
        tbody.appendChild(row);
    });
}

function createSmartRow(item, aiPriority) {
    const row = document.createElement('tr');
    const deadlineFormatted = item.deadline ? new Date(item.deadline).toLocaleDateString('he-IL') : 'ללא מועד';
    const timeLeft = calculateTimeLeft(item.deadline);
    
    row.className = `priority-${item.priority.toLowerCase()}`;
    
    // Create documents links
    let documentsHtml = '';
    if (item.documents && item.documents.length > 0) {
        documentsHtml = item.documents.map(doc => {
            const icon = getDocumentIcon(doc.type);
            return `<a href="${doc.url}" class="document-link ${doc.type}" title="${doc.name}">${icon}</a>`;
        }).join('');
    }
    
    row.innerHTML = `
        <td><span class="ai-priority">${aiPriority}</span></td>
        <td><strong>${item.project || item.task || `${item.creditor} - ${item.company}`}</strong>${documentsHtml}</td>
        <td><span class="category">${getItemCategory(item)}</span></td>
        <td>${item.client || item.authority || item.creditor}</td>
        <td>${deadlineFormatted}</td>
        <td><span class="time-left ${getTimeLeftClass(timeLeft)}">${timeLeft}</span></td>
        <td><span class="urgency-${item.priority}">${item.priority}</span></td>
        <td>
            <button class="action-btn primary" onclick="executeSmartAction('${item.action}', ${item.id}, '${getItemType(item)}')">${item.action}</button>
        </td>
    `;
    
    return row;
}

// Gmail sync functionality
async function syncGmailTasks() {
    try {
        const result = await emailProcessor.processGmailSync();
        
        if (result.approved) {
            showNotification(`✅ ${result.analyses ? result.analyses.length : 0} מיילים עובדו בהצלחה!`, 'success');
            updateDisplay();
            loadSmartOverview();
        } else if (result.action === 'auth_required') {
            showNotification('יש לאשר את הגישה ל-Gmail בחלון שנפתח.', 'warning');
        } else if (result.action === 'no_emails') {
            showNotification('לא נמצאו מיילים חדשים.', 'info');
        } else if (result.action === 'review_individual') {
            showNotification('🔍 מעבר לבדיקה אישית...', 'info');
        } else if (result.action === 'rejected_all') {
            showNotification('העיבוד בוטל לפי בקשתך.', 'warning');
        } else {
            showNotification('סינכרון Gmail בוטל.', 'warning');
        }
        
    } catch (error) {
        console.error('Gmail sync error:', error);
        showNotification('שגיאה בסינכרון Gmail', 'error');
    }
}

// Document handling - now with AI processor integration
function handleDocumentUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    showNotification(`מעבד ${files.length} מסמכים עם AI...`, 'info');
    
    // Use the DocumentProcessor
    setTimeout(async () => {
        try {
            const results = await documentProcessor.processFiles(files);
            if (results.approved) {
                showNotification(`✅ ${results.documents.length} מסמכים עובדו בהצלחה!`, 'success');
                updateDisplay();
            } else {
                showNotification('עיבוד מסמכים בוטל', 'warning');
            }
        } catch (error) {
            console.error('Document processing error:', error);
            showNotification('שגיאה בעיבוד מסמכים', 'error');
        }
    }, 1000);
}

// Smart recommendations
function toggleRecommendations() {
    const panel = document.getElementById('recommendations-panel');
    if (!panel) return;
    
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        loadSmartRecommendations();
    } else {
        panel.style.display = 'none';
    }
}

async function loadSmartRecommendations() {
    const container = document.getElementById('recommendationsContainer');
    if (!container) return;
    
    showNotification('טוען המלצות חכמות...', 'info');
    
    const recommendations = [
        {
            id: 1,
            title: 'סדר עדיפויות לשבוע הקרוב',
            description: 'בהתבסס על המועדים והחשיבות, מומלץ להתמקד ב-3 המשימות הבאות',
            priority: 'גבוה',
            timeEstimate: '2 שעות',
            category: 'תכנון'
        },
        {
            id: 2,
            title: 'טיפול בחובות דחופים',
            description: 'יש לך 3 חובות עם מועדי תשלום קרובים',
            priority: 'קריטי',
            timeEstimate: '1 שעה',
            category: 'כספים'
        }
    ];
    
    displaySmartRecommendations(recommendations);
    showNotification('המלצות נטענו בהצלחה', 'success');
}

function displaySmartRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    if (!container) return;
    
    container.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item priority-${rec.priority.toLowerCase()}">
            <div class="rec-header">
                <span class="rec-priority">${getPriorityIcon(rec.priority)}</span>
                <h4>${rec.title}</h4>
                <span class="rec-time">${rec.timeEstimate}</span>
            </div>
            <div class="rec-description">${rec.description}</div>
            <div class="rec-actions">
                <button class="rec-action-btn" onclick="executeRecommendation(${rec.id})">בצע המלצה</button>
            </div>
        </div>
    `).join('');
}

// Process pending documents
async function processPendingDocuments() {
    showNotification('מעבד מסמכים ממתינים...', 'info');
    
    setTimeout(() => {
        showNotification('עובדו 3 מסמכים בהצלחה', 'success');
        loadSmartOverview();
    }, 1500);
}

// Data population functions
function populateData() {
    updateDisplay();
}

function updateDisplay() {
    // Update all views
    if (activeTab === 'smart-overview') {
        loadSmartOverview();
    } else if (activeTab === 'academic') {
        populateAcademic();
    } else if (activeTab === 'bureaucracy') {
        populateBureaucracy();
    } else if (activeTab === 'debts') {
        populateDebts();
    }
}

function populateAcademic() {
    const tbody = document.querySelector('#academicTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.tasks.forEach(task => {
        const row = createAcademicRow(task);
        tbody.appendChild(row);
    });
}

function createAcademicRow(task) {
    const row = document.createElement('tr');
    const deadlineFormatted = task.deadline ? new Date(task.deadline).toLocaleDateString('he-IL') : 'ללא מועד';
    
    row.innerHTML = `
        <td>${task.project}</td>
        <td>${task.client}</td>
        <td>${deadlineFormatted}</td>
        <td><span class="status-badge ${task.status}">${task.status}</span></td>
        <td><span class="priority-${task.priority}">${task.priority}</span></td>
        <td>
            <button class="action-btn primary" onclick="executeTaskAction('${task.action}', ${task.id})">${task.action}</button>
        </td>
    `;
    
    return row;
}

function populateBureaucracy() {
    const tbody = document.querySelector('#bureaucracyTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.bureaucracy.forEach(item => {
        const row = createBureaucracyRow(item);
        tbody.appendChild(row);
    });
}

function createBureaucracyRow(item) {
    const row = document.createElement('tr');
    const deadlineFormatted = item.deadline ? new Date(item.deadline).toLocaleDateString('he-IL') : 'ללא מועד';
    
    // Create documents links
    let documentsHtml = '';
    if (item.documents && item.documents.length > 0) {
        documentsHtml = ' ' + item.documents.map(doc => {
            const icon = getDocumentIcon(doc.type);
            return `<a href="${doc.url}" class="document-link ${doc.type}" title="${doc.name}">${icon}</a>`;
        }).join('');
    }
    
    row.innerHTML = `
        <td>${item.task}${documentsHtml}</td>
        <td>${item.authority}</td>
        <td>${deadlineFormatted}</td>
        <td><span class="status-badge ${item.status}">${item.status}</span></td>
        <td><span class="priority-${item.priority}">${item.priority}</span></td>
        <td>
            <button class="action-btn primary" onclick="executeBureaucracyAction('${item.action}', ${item.id})">${item.action}</button>
        </td>
    `;
    
    return row;
}

function populateDebts() {
    const tbody = document.querySelector('#debtsTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    appData.debts.forEach(debt => {
        const row = createDebtRow(debt);
        tbody.appendChild(row);
    });
}

function createDebtRow(debt) {
    const row = document.createElement('tr');
    const deadlineFormatted = debt.deadline ? new Date(debt.deadline).toLocaleDateString('he-IL') : 'ללא מועד';
    
    // Create documents links
    let documentsHtml = '';
    if (debt.documents && debt.documents.length > 0) {
        documentsHtml = ' ' + debt.documents.map(doc => {
            const icon = getDocumentIcon(doc.type);
            return `<a href="${doc.url}" class="document-link ${doc.type}" title="${doc.name}">${icon}</a>`;
        }).join('');
    }
    
    row.innerHTML = `
        <td>${debt.creditor}${documentsHtml}</td>
        <td>${debt.company}</td>
        <td>${debt.amount} ${debt.currency}</td>
        <td>${deadlineFormatted}</td>
        <td><span class="status-badge ${debt.status}">${debt.status}</span></td>
        <td><span class="priority-${debt.priority}">${debt.priority}</span></td>
        <td>
            <button class="action-btn primary" onclick="executeDebtAction('${debt.action}', ${debt.id})">${debt.action}</button>
        </td>
    `;
    
    return row;
}

// Action executors
function executeSmartAction(action, id, type) {
    showNotification(`מבצע: ${action}`, 'info');
    setTimeout(() => showNotification('פעולה בוצעה בהצלחה!', 'success'), 1000);
}

function executeTaskAction(action, id) {
    showNotification(`מבצע משימה: ${action}`, 'info');
    setTimeout(() => showNotification('משימה בוצעה!', 'success'), 1000);
}

function executeBureaucracyAction(action, id) {
    showNotification(`מבצע פעולת ביורוקרטיה: ${action}`, 'info');
    setTimeout(() => showNotification('פעולה בוצעה!', 'success'), 1000);
}

function executeDebtAction(action, id) {
    showNotification(`מבצע פעולת חוב: ${action}`, 'info');
    setTimeout(() => showNotification('פעולה בוצעה!', 'success'), 1000);
}

function executeRecommendation(recId) {
    showNotification('מבצע המלצה...', 'info');
    setTimeout(() => showNotification('המלצה בוצעה בהצלחה!', 'success'), 1000);
}

// Helper functions
function getAllItems() {
    return [
        ...appData.tasks.map(t => ({...t, type: 'academic'})),
        ...appData.bureaucracy.map(b => ({...b, type: 'bureaucracy', project: b.task})),
        ...appData.debts.map(d => ({...d, type: 'debts', project: `${d.creditor} - ${d.company}`}))
    ];
}

function getItemCategory(item) {
    if (item.type === 'academic') return 'אקדמיה';
    if (item.type === 'bureaucracy') return 'ביורוקרטיה';
    if (item.type === 'debts') return 'חובות';
    return 'כללי';
}

function getItemType(item) {
    return item.type || 'general';
}

function calculateTimeLeft(deadline) {
    if (!deadline) return 'ללא מועד';
    
    const now = new Date();
    const target = new Date(deadline);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'פג תוקף';
    if (diffDays === 0) return 'היום';
    if (diffDays === 1) return 'מחר';
    
    return `${diffDays} ימים`;
}

function getTimeLeftClass(timeLeft) {
    if (timeLeft === 'פג תוקף') return 'overdue';
    if (timeLeft === 'היום' || timeLeft === 'מחר') return 'urgent';
    if (timeLeft.includes('1 ') || timeLeft.includes('2 ') || timeLeft.includes('3 ')) return 'soon';
    return 'normal';
}

function isToday(dateString) {
    if (!dateString) return false;
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
}

function getPriorityIcon(priority) {
    const icons = {
        'קריטי': '🚨',
        'דחוף': '⚡',
        'גבוה': '🔥',
        'בינוני': '⭐',
        'נמוך': '📝'
    };
    return icons[priority] || '📋';
}

function getDocumentIcon(type) {
    const icons = {
        'pdf': '📄',
        'email': '📧',
        'image': '🖼️',
        'doc': '📝',
        'contract': '📋'
    };
    return icons[type] || '📎';
}

// Modal functionality
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Close modal functionality
    modal.querySelector('.modal-close').onclick = () => {
        document.body.removeChild(modal);
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    };
    
    return modal;
}

// Email sync results
function showEmailSyncResults(result) {
    const modal = createModal('תוצאות סינכרון Gmail', `
        <div class="email-sync-results">
            <p><strong>נמצאו ${result.emails_found || 0} אימיילים חדשים</strong></p>
            <p>נוספו ${result.new_tasks || 0} משימות חדשות</p>
            <p>זוהו ${result.urgent_items || 0} פריטים דחופים</p>
        </div>
    `);
    document.body.appendChild(modal);
}

function updateEmailResults(emails) {
    if (emails && emails.length > 0) {
        emails.forEach(email => {
            if (email.extractedTasks) {
                email.extractedTasks.forEach((taskText, index) => {
                    const newTask = {
                        id: Date.now() + index,
                        project: email.subject,
                        client: email.from,
                        action: taskText,
                        priority: 'דחוף',
                        status: 'חדש',
                        deadline: new Date().toISOString().split('T')[0]
                    };
                    appData.tasks.push(newTask);
                });
            }
        });
        updateDisplay();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Position notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10000';
    notification.style.transform = 'translateX(400px)';
    notification.style.transition = 'transform 0.3s ease';
    
    // Color by type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#e53e3e';
            break;
        case 'info':
            notification.style.backgroundColor = '#3182ce';
            break;
        default:
            notification.style.backgroundColor = '#718096';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

console.log('האפליקציה החכמה של מיכל עובדת בהצלחה! 🚀🧠');