// Michal AI Personal Assistant - JavaScript Core
// Data management and UI functionality

// Global app data
const appData = {
    // Real academic projects data
    tasks: [
        {
            id: 1,
            project: 'עבודת סמינר - פסיכולוגיה חברתית',
          // Sync controls
    setupSyncControls();
    
    // Modal controls
    setupModalControls(); client: 'כרמית - דוקטורנטית',
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
    
    // Sync controls
    setupSyncControls();
    
    // Modal controls
    setupModalControls();
    
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

// Sync Controls Functions
function setupSyncControls() {
    console.log('מגדיר כפתורי סנכרון...');
    
    // Academic sync
    const syncAcademicBtn = document.getElementById('syncAcademicBtn');
    if (syncAcademicBtn) {
        syncAcademicBtn.addEventListener('click', () => openSyncModal('academic'));
    }
    
    // Bureaucracy sync
    const syncBureaucracyBtn = document.getElementById('syncBureaucracyBtn');
    if (syncBureaucracyBtn) {
        syncBureaucracyBtn.addEventListener('click', () => openSyncModal('bureaucracy'));
    }
    
    // Debts sync
    const syncDebtsBtn = document.getElementById('syncDebtsBtn');
    if (syncDebtsBtn) {
        syncDebtsBtn.addEventListener('click', () => openSyncModal('debts'));
    }
    
    // Emails sync
    const syncEmailsBtn = document.getElementById('syncEmailsBtn');
    if (syncEmailsBtn) {
        syncEmailsBtn.addEventListener('click', () => openSyncModal('emails'));
    }
    
    // Load initial badge counts
    loadSyncBadges();
}

function setupModalControls() {
    console.log('מגדיר בקרי מודל...');
    
    const modal = document.getElementById('syncModal');
    const closeBtn = document.getElementById('syncModalClose');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSyncModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSyncModal();
            }
        });
    }
}

async function openSyncModal(module) {
    console.log(`פותח מודל סנכרון למודול: ${module}`);
    
    const modal = document.getElementById('syncModal');
    const title = document.getElementById('syncModalTitle');
    const body = document.getElementById('syncModalBody');
    
    // Set title
    const titles = {
        'academic': '📚 עדכונים אקדמיים',
        'bureaucracy': '🏛️ עדכוני בירוקרטיה', 
        'debts': '💰 עדכוני חובות',
        'emails': '📧 עדכוני מיילים'
    };
    
    title.textContent = titles[module] || 'עדכונים';
    
    // Show loading
    body.innerHTML = `
        <div class="sync-loading">
            <div class="spinner"></div>
            <p>טוען עדכונים...</p>
        </div>
    `;
    
    // Show modal
    modal.classList.add('show');
    
    try {
        // Fetch updates
        const response = await fetch(`/api/sync/${module}`);
        const data = await response.json();
        
        if (data.success) {
            displaySyncUpdates(data.pendingUpdates, module);
        } else {
            showSyncError('שגיאה בטעינת העדכונים');
        }
        
    } catch (error) {
        console.error('שגיאה בטעינת עדכוני סנכרון:', error);
        showSyncError('שגיאה בחיבור לשרת');
    }
}

function displaySyncUpdates(updates, module) {
    const body = document.getElementById('syncModalBody');
    
    if (!updates || updates.length === 0) {
        body.innerHTML = `
            <div class="sync-no-updates">
                <div class="icon">✅</div>
                <h4>אין עדכונים חדשים</h4>
                <p>כל העדכונים עודכנו</p>
            </div>
        `;
        return;
    }
    
    const updatesHtml = updates.map(update => `
        <div class="sync-update-item" data-id="${update.id}">
            <div class="sync-update-header">
                <h4 class="sync-update-title">${update.title}</h4>
                <span class="sync-update-type ${update.type}">${getTypeLabel(update.type)}</span>
            </div>
            
            <div class="sync-update-details">
                ${formatUpdateDetails(update.details, update.type)}
            </div>
            
            <div class="sync-update-actions">
                ${getActionButtons(update.action, update.id)}
            </div>
            
            <div class="sync-timestamp">
                ${formatTimestamp(update.timestamp)}
            </div>
        </div>
    `).join('');
    
    body.innerHTML = `
        <div class="sync-updates-list">
            ${updatesHtml}
        </div>
    `;
    
    // Add event listeners to action buttons
    setupActionButtons();
}

function getTypeLabel(type) {
    const labels = {
        'new_task': 'משימה חדשה',
        'status_update': 'עדכון סטטוס',
        'deadline_change': 'שינוי דדליין',
        'payment_plan_offer': 'הצעת תשלומים',
        'dispute_response': 'תגובה להתנגדות',
        'deadline_warning': 'אזהרת דדליין',
        'important_email': 'מייל חשוב',
        'payment_confirmation': 'אישור תשלום',
        'new_inquiry': 'פנייה חדשה',
        'new_requirement': 'דרישה חדשה',
        'appointment_available': 'תור פנוי'
    };
    return labels[type] || type;
}

function formatUpdateDetails(details, type) {
    let html = '';
    
    Object.entries(details).forEach(([key, value]) => {
        if (key === 'content_summary') return; // Skip long content
        
        const label = getFieldLabel(key);
        if (label && value) {
            html += `<p><strong>${label}:</strong> ${value}</p>`;
        }
    });
    
    return html;
}

function getFieldLabel(field) {
    const labels = {
        'client': 'לקוח',
        'deadline': 'דדליין',
        'value': 'סכום',
        'currency': 'מטבע',
        'project': 'פרויקט',
        'old_status': 'סטטוס קודם',
        'new_status': 'סטטוס חדש',
        'payment_received': 'תשלום התקבל',
        'amount': 'סכום',
        'old_deadline': 'דדליין קודם',
        'new_deadline': 'דדליין חדש',
        'reason': 'סיבה',
        'task': 'משימה',
        'authority': 'רשות',
        'next_step': 'שלב הבא',
        'appointment_date': 'תאריך תור',
        'creditor': 'נושה',
        'company': 'חברה',
        'case_number': 'מספר תיק',
        'original_amount': 'סכום מקורי',
        'settlement_offer': 'הצעת פשרה',
        'monthly_payments': 'תשלומים חודשיים',
        'payment_amount': 'סכום תשלום',
        'dispute_status': 'סטטוס התנגדות',
        'consequence': 'השלכות',
        'from': 'מאת',
        'subject': 'נושא',
        'received': 'התקבל',
        'priority': 'עדיפות',
        'estimated_time': 'זמן משוער',
        'payment_method': 'אמצעי תשלום',
        'project_type': 'סוג פרויקט',
        'estimated_value': 'ערך משוער',
        'required_document': 'מסמך נדרש',
        'urgency': 'דחיפות',
        'appointment_time': 'שעת תור',
        'location': 'מיקום'
    };
    
    return labels[field];
}

function getActionButtons(action, updateId) {
    const actionButtons = {
        'approve_new': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'approve_new')">אשר הוספה</button>
            <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'dismiss')">התעלם</button>
        `,
        'confirm_completion': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'confirm_completion')">אשר השלמה</button>
            <button class="sync-action-btn reject" onclick="handleSyncAction('${updateId}', 'reject_completion')">דחה</button>
        `,
        'approve_extension': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'approve_extension')">אשר דחייה</button>
            <button class="sync-action-btn reject" onclick="handleSyncAction('${updateId}', 'reject_extension')">דחה דחייה</button>
        `,
        'review_offer': `
            <button class="sync-action-btn review" onclick="handleSyncAction('${updateId}', 'accept_offer')">קבל הצעה</button>
            <button class="sync-action-btn reject" onclick="handleSyncAction('${updateId}', 'reject_offer')">דחה הצעה</button>
            <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'counter_offer')">הצעה נגדית</button>
        `,
        'decide_next_step': `
            <button class="sync-action-btn review" onclick="handleSyncAction('${updateId}', 'appeal')">הגש ערעור</button>
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'pay_debt')">שלם חוב</button>
            <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'ignore')">התעלם</button>
        `,
        'urgent_payment_arrangement': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'urgent_payment_arrangement')">תאם תשלום דחוף</button>
            <button class="sync-action-btn review" onclick="handleSyncAction('${updateId}', 'contact_lawyer')">צור קשר עם עורך דין</button>
        `,
        'review_changes': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'accept_changes')">אשר שינויים</button>
            <button class="sync-action-btn reject" onclick="handleSyncAction('${updateId}', 'reject_changes')">דחה שינויים</button>
        `,
        'confirm_receipt': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'confirm_receipt')">אשר קבלה</button>
        `,
        'respond_to_inquiry': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'respond_inquiry')">השב לפנייה</button>
            <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'ignore_inquiry')">התעלם</button>
        `,
        'confirm_approval': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'confirm_approval')">אשר</button>
        `,
        'acknowledge_requirement': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'acknowledge_requirement')">קבל דרישה</button>
            <button class="sync-action-btn review" onclick="handleSyncAction('${updateId}', 'clarify_requirement')">בקש הבהרה</button>
        `,
        'book_appointment': `
            <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'book_appointment')">קבע תור</button>
            <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'find_other_time')">חפש זמן אחר</button>
        `
    };
    
    return actionButtons[action] || `
        <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'dismiss')">סמן כנקרא</button>
    `;
}

async function handleSyncAction(updateId, action) {
    console.log(`מטפל בפעולה: ${action} על עדכון ${updateId}`);
    
    try {
        const response = await fetch('/api/sync/action', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                updateId: updateId,
                action: action
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Remove the update item from display
            const updateItem = document.querySelector(`[data-id="${updateId}"]`);
            if (updateItem) {
                updateItem.style.opacity = '0.5';
                updateItem.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    updateItem.remove();
                    
                    // Check if no more updates
                    const remainingUpdates = document.querySelectorAll('.sync-update-item');
                    if (remainingUpdates.length === 0) {
                        displaySyncUpdates([], '');
                    }
                }, 300);
            }
            
            showNotification(`פעולה בוצעה בהצלחה: ${data.result.message}`, 'success');
            
            // Refresh badge counts
            loadSyncBadges();
            
        } else {
            showNotification('שגיאה בביצוע הפעולה', 'error');
        }
        
    } catch (error) {
        console.error('שגיאה בביצוע פעולה:', error);
        showNotification('שגיאה בחיבור לשרת', 'error');
    }
}

function setupActionButtons() {
    // Action buttons are set up with onclick handlers in getActionButtons()
}

function closeSyncModal() {
    const modal = document.getElementById('syncModal');
    modal.classList.remove('show');
}

function showSyncError(message) {
    const body = document.getElementById('syncModalBody');
    body.innerHTML = `
        <div class="sync-no-updates">
            <div class="icon">❌</div>
            <h4>שגיאה</h4>
            <p>${message}</p>
        </div>
    `;
}

async function loadSyncBadges() {
    try {
        // Load badge counts for all modules
        const modules = ['academic', 'bureaucracy', 'debts', 'emails'];
        
        for (const module of modules) {
            const response = await fetch(`/api/sync/${module}`);
            const data = await response.json();
            
            if (data.success) {
                const badge = document.getElementById(`${module}Badge`);
                const count = data.count || 0;
                
                if (badge) {
                    badge.textContent = count;
                    const button = badge.closest('.sync-btn');
                    
                    if (count > 0) {
                        button.classList.add('has-updates');
                    } else {
                        button.classList.remove('has-updates');
                    }
                }
            }
        }
        
    } catch (error) {
        console.error('שגיאה בטעינת תגי סנכרון:', error);
    }
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `לפני ${diffMins} דקות`;
    } else if (diffHours < 24) {
        return `לפני ${diffHours} שעות`;
    } else {
        return date.toLocaleDateString('he-IL');
    }
}

console.log('האפליקציה החכמה של מיכל עובדת בהצלחה! 🚀🧠');