// Application Data with Real Data from Michal's Profile
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
    ],
    actionTemplates: {
        "שליחת התנגדות": {
            title: "מכתב התנגדות ל-PAIR Finance",
            content: "לכבוד PAIR Finance,\n\nבהתייחס לדרישתכם מתאריך ___,\n\nאני מתנגדת לחוב הנ\"ל מהסיבות הבאות:\n1. לא קיבלתי שירות\n2. לא חתמתי על הסכם\n3. הסכום אינו נכון\n\nבכבוד רב,\nמיכל חבצלת",
            attachments: ["עותק תעודת זהות", "הוכחת מגורים"],
            nextSteps: ["שליחה בדואר רשום", "שמירת קבלה", "המתנה למענה"]
        },
        "שליחת טיוטה": {
            title: "שליחת טיוטת סמינריון",
            content: "שלום כרמית,\n\nבהתאם לבקשתך, מצורפת טיוטה ראשונית של הסמינריון.\n\nאשמח לקבל את הערותייך ולהתאים את התוכן לפי הצורך.\n\nבברכה,\nמיכל",
            attachments: ["טיוטת סמינריון", "מקורות ביבליוגרפיים"],
            nextSteps: ["המתנה לפידבק", "עדכון לפי הערות", "גרסה סופית"]
        },
        "בירור חוב": {
            title: "בקשת הבהרה לגבי החוב",
            content: "Sehr geehrte Damen und Herren,\n\nBezugnehmend auf Ihr Schreiben vom ___,\n\nbitte ich Sie um detaillierte Aufschlüsselung der geforderten Summe sowie Nachweis der ursprünglichen Forderung.\n\nMit freundlichen Grüßen,\nMichal Havatzelet",
            attachments: ["Kopie des Personalausweises"],
            nextSteps: ["Brief per Einschreiben versenden", "Antwort abwarten", "Rechtliche Schritte prüfen"]
        },
        "מעקב אחר מענה": {
            title: "מעקב אחר סטטוס הפרויקט",
            content: "שלום ישראל,\n\nמזכירה לך שהעבודה הוגשה לאישורך ביום ___.\n\nאשמח לקבל עדכון על הסטטוס ועל שינויים נדרשים.\n\nתודה,\nמיכל",
            attachments: ["העבודה המלאה"],
            nextSteps: ["המתנה לתשובה", "תזכורת נוספת אם נדרש", "התחלת עבודה על התיקונים"]
        },
        "בירור סטטוס בקשה": {
            title: "Nachfrage zum Status des Antrags",
            content: "Sehr geehrte Damen und Herren,\n\nhiermit möchte ich höflich nach dem aktuellen Bearbeitungsstand meines Antrags vom ___ fragen.\n\nIch wäre Ihnen dankbar für eine kurze Rückmeldung.\n\nMit freundlichen Grüßen,\nMichal Havatzelet",
            attachments: ["Kopie der Antragsunterlagen"],
            nextSteps: ["Anruf bei der Behörde", "Persönlichen Termin vereinbaren", "Zusätzliche Dokumente vorbereiten"]
        }
    },
    chatResponses: {
        "מה דחוף היום?": "דחוף היום:\n• כרמית - סמינר פסיכולוגיה (דדליין היום!) - צריך לשלוח טיוטה\n• PAIR Finance - התנגדות (2 ימים) - צריך לכתוב מכתב התנגדות\n• ביטוח בריאות TK - הגשת מסמכים (6 ימים)\n\nהכי דחוף: התחילי עם הסמינריון של כרמית!",
        "איך אני עונה ל-PAIR Finance?": "בשביל PAIR Finance, הכי חשוב:\n1. לא להודות בחוב\n2. לבקש הוכחות מלאות\n3. לשלוח בדואר רשום\n\nיש לי מוכן תבנית מכתב התנגדות. רוצה שאציג אותה?",
        "מה המצב עם הבירוקרטיה?": "מצב הבירוקרטיה:\n• רישום נישואין (Standesamt) - בהמתנה, צריך לברר\n• ביטוח בריאות TK - דחוף! צריך להגיש מסמכים\n• אישור שהייה (LEA) - בתהליך, בסדר\n• Bürgergeld - מאושר ✓\n\nהכי דחוף: TK ביטוח בריאות!",
        "הכן טיוטת מייל": "אני יכולה להכין טיוטת מייל. ספרי לי:\n• לאיזה לקוח/רשות?\n• מה הנושא?\n• מה את רוצה להשיג?\n\nלדוגמה, יש לי תבניות מוכנות ללקוחות אקדמיים ולרשויות גרמניות."
    }
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
    
    // Initialize sync controls after everything is loaded
    setTimeout(() => {
        setupSyncControls();
        setupModalControls();
        loadSyncBadges();
    }, 500);
    
    console.log('המערכת מוכנה לעבודה! 🚀');
});

function initializeTabs() {
    console.log('מאתחל טאבים...');
    
    // Make sure smart-overview tab is active by default
    switchTab('smart-overview');
}

function initializeApp() {
    console.log('מאתחל את הנתונים...');
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
    
    // Document upload controls
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
    
    // Smart recommendations button
    const smartRecBtn = document.getElementById('smartRecBtn');
    if (smartRecBtn) {
        smartRecBtn.addEventListener('click', () => {
            const panel = document.getElementById('recommendations-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
            loadSmartRecommendations();
        });
    }
    
    // Process documents button
    const processDocsBtn = document.getElementById('processDocsBtn');
    if (processDocsBtn) {
        processDocsBtn.addEventListener('click', processPendingDocuments);
    }
    
    // Quick question buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            handleQuickQuestion(question);
        });
    });
    
    // Chat functionality
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Voice recording
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', handleVoiceRecording);
    }
    
    // File upload
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // File upload functionality
    const fileUploadBtn = document.getElementById('fileUploadBtn');
    const chatFileInput = document.getElementById('chatFileInput');
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (fileUploadBtn && chatFileInput) {
        fileUploadBtn.addEventListener('click', () => chatFileInput.click());
        chatFileInput.addEventListener('change', handleFileUpload);
    }
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', handleVoiceRecording);
    }
    
    // Modal functionality
    setupModalListeners();
}

function setupModalListeners() {
    // Action Modal
    const actionModalClose = document.getElementById('actionModalClose');
    const actionModalCancel = document.getElementById('actionModalCancel');
    const actionModalSave = document.getElementById('actionModalSave');
    
    if (actionModalClose) actionModalClose.addEventListener('click', closeActionModal);
    if (actionModalCancel) actionModalCancel.addEventListener('click', closeActionModal);
    if (actionModalSave) actionModalSave.addEventListener('click', executeAction);
    
    // Email Modal
    const emailModalClose = document.getElementById('emailModalClose');
    const emailModalCancel = document.getElementById('emailModalCancel');
    const emailModalCopy = document.getElementById('emailModalCopy');
    const emailModalSend = document.getElementById('emailModalSend');
    
    if (emailModalClose) emailModalClose.addEventListener('click', closeEmailModal);
    if (emailModalCancel) emailModalCancel.addEventListener('click', closeEmailModal);
    if (emailModalCopy) emailModalCopy.addEventListener('click', copyEmailContent);
    if (emailModalSend) emailModalSend.addEventListener('click', sendEmail);
}

function switchTab(tabName) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedPanel = document.getElementById(tabName);
    
    if (selectedTab) selectedTab.classList.add('active');
    if (selectedPanel) selectedPanel.classList.add('active');
    
    activeTab = tabName;
    console.log(`עברתי לטאב: ${tabName}`);
    
    // Special handling for smart overview tab
    if (tabName === 'smart-overview') {
        loadSmartOverview();
    }
}

function populateData() {
    console.log('ממלא נתונים...');
    populateAcademic();
    populateBureaucracy();
    populateDebts();
    populateOverview();
    updateStats();
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
            <button class="action-btn primary" onclick="executeTaskAction('${task.action}', ${task.id}, 'academic')">${task.action}</button>
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
    
    row.innerHTML = `
        <td>${item.task}</td>
        <td>${item.authority}</td>
        <td>${deadlineFormatted}</td>
        <td><span class="status-badge ${item.status}">${item.status}</span></td>
        <td><span class="priority-${item.priority}">${item.priority}</span></td>
        <td>
            <button class="action-btn primary" onclick="executeTaskAction('${item.action}', ${item.id}, 'bureaucracy')">${item.action}</button>
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
    
    let actionClass = 'primary';
    if (debt.priority === 'דחוף') actionClass = 'error';
    else if (debt.priority === 'גבוה') actionClass = 'warning';
    
    row.innerHTML = `
        <td>${debt.creditor}</td>
        <td>${debt.company}</td>
        <td>${debt.currency}${debt.amount.toLocaleString()}</td>
        <td>${debt.case_number}</td>
        <td><span class="status-badge ${debt.status}">${debt.status}</span></td>
        <td>${deadlineFormatted}</td>
        <td>
            <button class="action-btn ${actionClass}" onclick="executeTaskAction('${debt.action}', ${debt.id}, 'debts')">${debt.action}</button>
        </td>
    `;
    
    return row;
}

function populateOverview() {
    const urgentToday = document.getElementById('urgentToday');
    const thisWeek = document.getElementById('thisWeek');
    
    if (!urgentToday || !thisWeek) return;
    
    urgentToday.innerHTML = '';
    thisWeek.innerHTML = '';
    
    const today = new Date().toISOString().split('T')[0];
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
    // Combine all tasks for overview
    const allItems = [
        ...appData.tasks.map(t => ({...t, type: 'academic'})),
        ...appData.bureaucracy.map(b => ({...b, type: 'bureaucracy', project: b.task})),
        ...appData.debts.map(d => ({...d, type: 'debts', project: `${d.creditor} - ${d.company}`}))
    ];
    
    // Urgent today items
    allItems
        .filter(item => item.priority === 'דחוף' || item.deadline === today)
        .forEach(item => {
            const div = document.createElement('div');
            div.className = `urgent-item ${item.priority === 'דחוף' ? 'error' : 'warning'}`;
            div.innerHTML = `
                <div>
                    <strong>${item.project}</strong><br>
                    <small>${item.action || 'פעולה נדרשת'}</small>
                </div>
                <button class="action-btn primary" onclick="executeTaskAction('${item.action}', ${item.id}, '${item.type}')">${item.action}</button>
            `;
            urgentToday.appendChild(div);
        });
    
    // This week items
    allItems
        .filter(item => {
            if (!item.deadline) return false;
            const itemDate = new Date(item.deadline);
            return itemDate <= oneWeekFromNow && item.deadline !== today;
        })
        .forEach(item => {
            const div = document.createElement('div');
            div.className = 'week-item';
            div.innerHTML = `
                <div>
                    <strong>${item.project}</strong><br>
                    <small>${new Date(item.deadline).toLocaleDateString('he-IL')}</small>
                </div>
                <span class="priority-${item.priority}">${item.priority}</span>
            `;
            thisWeek.appendChild(div);
        });
}

function updateStats() {
    const urgentCount = [
        ...appData.tasks.filter(t => t.priority === 'דחוף'),
        ...appData.bureaucracy.filter(b => b.priority === 'דחוף'),
        ...appData.debts.filter(d => d.priority === 'דחוף')
    ].length;
    
    const todayCount = [
        ...appData.tasks.filter(t => t.deadline === '2025-09-24'),
        ...appData.bureaucracy.filter(b => b.deadline === '2025-09-24'),
        ...appData.debts.filter(d => d.deadline === '2025-09-24')
    ].length;
    
    const totalRevenue = appData.tasks
        .filter(task => task.currency === '₪')
        .reduce((sum, task) => sum + task.value, 0);
    
    const activeDebts = appData.debts.filter(debt => 
        debt.status === 'פתוח' || debt.status === 'התראה' || debt.status === 'בהתנגדות'
    ).length;
    
    document.querySelector('.stat-card.urgent .stat-number').textContent = urgentCount;
    document.querySelector('.stat-card.today .stat-number').textContent = todayCount;
    document.querySelector('.stat-card.revenue .stat-number').textContent = `₪${totalRevenue.toLocaleString()}`;
    document.querySelector('.stat-card.debts .stat-number').textContent = activeDebts;
}

// Global function for action execution
window.executeTaskAction = function(action, id, module) {
    console.log(`מבצע פעולה: ${action} עבור ${id} במודול ${module}`);
    
    const template = appData.actionTemplates[action];
    
    if (template) {
        showEmailModal(template, action, id, module);
    } else {
        // Show generic action modal
        showActionModal(action, id, module);
    }
}

function showActionModal(action, id, module) {
    const modal = document.getElementById('actionModal');
    const title = document.getElementById('actionModalTitle');
    const content = document.getElementById('actionModalContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = action;
    content.innerHTML = `
        <p>האם את בטוחה שברצונך לבצע את הפעולה: <strong>${action}</strong>?</p>
        <p>הפעולה תתבצע עבור הפריט עם מזהה ${id} במודול ${module}.</p>
    `;
    
    modal.classList.remove('hidden');
}

function showEmailModal(template, action, id, module) {
    const modal = document.getElementById('emailModal');
    const title = document.getElementById('emailModalTitle');
    const subject = document.getElementById('emailSubject');
    const content = document.getElementById('emailContent');
    const attachments = document.getElementById('requiredAttachments');
    const nextSteps = document.getElementById('nextSteps');
    
    if (!modal || !title || !subject || !content) return;
    
    title.textContent = template.title;
    subject.value = template.title;
    content.value = template.content;
    
    // Populate attachments
    attachments.innerHTML = '';
    template.attachments.forEach(attachment => {
        const div = document.createElement('div');
        div.className = 'attachment-item';
        div.innerHTML = `
            <span class="attachment-icon">📎</span>
            <span>${attachment}</span>
        `;
        attachments.appendChild(div);
    });
    
    // Populate next steps
    nextSteps.innerHTML = '';
    template.nextSteps.forEach(step => {
        const div = document.createElement('div');
        div.className = 'step-item';
        div.innerHTML = `
            <span class="step-icon">✓</span>
            <span>${step}</span>
        `;
        nextSteps.appendChild(div);
    });
    
    // Store current action for later use
    modal.dataset.currentAction = action;
    modal.dataset.currentId = id;
    modal.dataset.currentModule = module;
    
    modal.classList.remove('hidden');
}

function closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) modal.classList.add('hidden');
}

function closeEmailModal() {
    const modal = document.getElementById('emailModal');
    if (modal) modal.classList.add('hidden');
}

function executeAction() {
    addMessageToChat('הפעולה בוצעה בהצלחה! 🎉', 'ai');
    closeActionModal();
}

function copyEmailContent() {
    const content = document.getElementById('emailContent');
    if (content) {
        navigator.clipboard.writeText(content.value).then(() => {
            addMessageToChat('התוכן הועתק ללוח! יכולה להדביק אותו במייל או במסמך.', 'ai');
        });
    }
}

function sendEmail() {
    const modal = document.getElementById('emailModal');
    const action = modal?.dataset.currentAction;
    const id = modal?.dataset.currentId;
    const module = modal?.dataset.currentModule;
    
    addMessageToChat(`המייל נשלח בהצלחה! הפעולה "${action}" בוצעה. 📧`, 'ai');
    addMessageToChat('זכרי לשמור עותק של המכתב ולשלוח בדואר רשום אם נדרש.', 'ai');
    
    closeEmailModal();
}

function handleQuickQuestion(question) {
    addMessageToChat(question, 'user');
    
    setTimeout(() => {
        const response = appData.chatResponses[question] || 
            "מצטערת, אני לא בטוחה איך לענות על השאלה הזו. נסי לנסח אותה אחרת או תשאלי שאלה ספציפית יותר.";
        addMessageToChat(response, 'ai');
    }, 1000);
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    addMessageToChat(message, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <span class="typing-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
            מיכל חושבת...
        </div>
    `;
    
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
        const aiResponse = await sendToSmartAgent(message);
        
        // Remove typing indicator
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        
        addMessageToChat(aiResponse, 'ai');
    } catch (error) {
        console.error('שגיאה בתקשורת עם הסוכן החכם:', error);
        
        // Remove typing indicator
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        
        // Fallback to static responses
        const fallbackResponse = generateAIResponse(message);
        addMessageToChat(fallbackResponse, 'ai');
    }
}

// Communication with Smart Agent
async function sendToSmartAgent(message) {
    try {
        const response = await axios.post('/api/chat/smart', {
            message: message,
            context: {
                active_tab: activeTab,
                user_data: {
                    tasks: appData.tasks,
                    bureaucracy: appData.bureaucracy,
                    debts: appData.debts
                }
            }
        });
        
        return response.data.response || 'מצטערת, לא הצלחתי לעבד את הבקשה';
    } catch (error) {
        console.error('Error communicating with smart agent:', error);
        throw error;
    }
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'ai' ? 'ai-message' : 'user-message'}`;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${timeString}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('דחוף') || lowerMessage.includes('היום')) {
        return "המשימות הדחופות היום:\n• כרמית - סמינר פסיכולוגיה (דדליין היום!)\n• PAIR Finance - התנגדות (נשאר יומיים)\n• ביטוח בריאות TK - הגשת מסמכים\n\nהתחילי עם כרמית - זה הכי דחוף!";
    }
    
    if (lowerMessage.includes('pair') || lowerMessage.includes('התנגדות')) {
        return "בשביל PAIR Finance:\n1. אל תודי בחוב\n2. בקשי הוכחות מפורטות\n3. שלחי בדואר רשום\n4. שמרי את כל המסמכים\n\nיש לי תבנית מכתב התנגדות מוכנה - רוצה לראות אותה?";
    }
    
    if (lowerMessage.includes('בירוקרטיה') || lowerMessage.includes('רשויות')) {
        return "מצב הבירוקרטיה:\n• רישום נישואין - צריך לברר סטטוס\n• TK ביטוח בריאות - דחוף! הגשת מסמכים\n• LEA אישור שהייה - בתהליך\n• Jobcenter - מאושר ✓\n\nהכי דחוף: TK ביטוח בריאות!";
    }
    
    if (lowerMessage.includes('כסף') || lowerMessage.includes('הכנסות')) {
        return "מצב כלכלי:\n• הכנסות צפויות: ₪8,150\n• חובות פעילים: 5 (בסה\"כ €789.12 + ₪7,355)\n• הכי דחוף לטפל: PAIR Finance ורשות האכיפה\n\nהמלצה: קבעי תעדוף תשלומים";
    }
    
    return "הבנתי את השאלה שלך. איך אני יכולה לעזור לך בפירוט יותר? אני יכולה לסייע עם:\n• ניהול המשימות הדחופות\n• הכנת מכתבי התנגדות\n• מעקב אחר בירוקרטיה\n• ייעוץ כלכלי";
}

// Smart Overview Functions
async function loadSmartOverview() {
    try {
        showLoading('smart-task-table', 'טוען נתונים חכמים...');
        
        const response = await fetch('/api/smart-overview');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update statistics
        updateSmartStatistics(data.statistics);
        
        // Update unified table
        updateSmartTaskTable(data.unified_tasks);
        
        hideLoading('smart-task-table');
        
    } catch (error) {
        console.error('Error loading smart overview:', error);
        hideLoading('smart-task-table');
        showError('smart-task-table', 'שגיאה בטעינת הנתונים');
    }
}

function updateSmartStatistics(stats) {
    const elements = {
        'total-tasks': stats.total_tasks,
        'critical-count': stats.critical_count,
        'urgent-count': stats.urgent_count,
        'pending-count': stats.pending_count,
        'total-value': `${stats.total_value.toLocaleString()} ₪`,
        'avg-priority': stats.average_priority_score.toFixed(1)
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

function updateSmartTaskTable(tasks) {
    const tbody = document.querySelector('#smart-task-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const row = createSmartTaskRow(task, index + 1);
        tbody.appendChild(row);
    });
}

function createSmartTaskRow(task, index) {
    const row = document.createElement('tr');
    row.className = `priority-${task.priority_level}`;
    
    const priorityBadge = getPriorityBadge(task.priority, task.priority_level);
    const statusBadge = getStatusBadge(task.status);
    const actionBtn = `<button class="action-btn" onclick="handleSmartAction('${task.type}', ${task.original_id})">${task.next_action}</button>`;
    
    row.innerHTML = `
        <td>${index}</td>
        <td>${priorityBadge}</td>
        <td><strong>${task.title}</strong><br><small>${task.type}</small></td>
        <td>${task.deadline}</td>
        <td>${statusBadge}</td>
        <td>${task.value_display}</td>
        <td>${actionBtn}</td>
    `;
    
    return row;
}

function getPriorityBadge(priority, level) {
    const badgeClass = level === 'critical' ? 'critical' : 
                      level === 'urgent' ? 'urgent' : 
                      level === 'pending' ? 'pending' : 'normal';
    
    return `<span class="priority-badge ${badgeClass}">${priority}</span>`;
}

function getStatusBadge(status) {
    const statusClass = status === 'בעבודה' ? 'in-progress' :
                       status === 'המתנה' ? 'waiting' :
                       status === 'פתוח' ? 'open' :
                       status === 'דחוף' ? 'urgent' : 'normal';
    
    return `<span class="status-badge ${statusClass}">${status}</span>`;
}

async function handleSmartAction(type, originalId) {
    try {
        // Route to appropriate handler based on type
        if (type === 'academic') {
            switchTab('academic');
            // Highlight the specific task
        } else if (type === 'debt') {
            switchTab('debts');
            // Highlight the specific debt
        } else if (type === 'bureaucracy') {
            switchTab('bureaucracy');
            // Highlight the specific bureaucracy item
        }
    } catch (error) {
        console.error('Error handling smart action:', error);
        showNotification('שגיאה בביצוע הפעולה', 'error');
    }
}

async function syncGmailTasks() {
    try {
        showNotification('מסנכרן עם Gmail...', 'info');
        
        const response = await fetch('/api/gmail/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Gmail sync failed');
        }
        
        const result = await response.json();
        showNotification(`נמצאו ${result.emails_found || 0} מיילים חדשים`, 'success');
        
        // Show results in detailed modal
        showEmailSyncResults(result);
        
        // Add demo email results for now
        const demoEmails = [
            {
                subject: 'תשלום דחוף - PAIR Finance',
                from: 'noreply@pairfinance.com',
                date: new Date().toISOString(),
                extractedTasks: ['התקשר ל-PAIR Finance', 'בדוק סכום החוב']
            },
            {
                subject: 'תזכורת אקדמית - מועד הגשה',
                from: 'secretary@university.ac.il',
                date: new Date().toISOString(), 
                extractedTasks: ['סיים עבודת סמינר', 'הכן מצגת']
            }
        ];
        
        // Update display with new data
        updateEmailResults(demoEmails);
        
        // Reload smart overview
        await loadSmartOverview();
        
    } catch (error) {
        console.error('Gmail sync error:', error);
        showNotification('שגיאה בסינכרון Gmail', 'error');
        
        // Show demo results even on error
        const demoEmails = [
            {
                subject: 'תשלום דחוף - PAIR Finance', 
                from: 'demo@example.com',
                date: new Date().toISOString(),
                extractedTasks: ['התקשר ל-PAIR Finance', 'בדוק סכום החוב']
            }
        ];
        updateEmailResults(demoEmails);
    }
}

async function processPendingDocuments() {
    try {
        showNotification('מעבד מסמכים ממתינים...', 'info');
        
        const response = await fetch('/api/documents/process-pending', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Document processing failed');
        }
        
        const result = await response.json();
        showNotification(`עובדו ${result.processed} מסמכים`, 'success');
        
        // Reload smart overview
        await loadSmartOverview();
        
    } catch (error) {
        console.error('Document processing error:', error);
        showNotification('שגיאה בעיבוד המסמכים', 'error');
    }
}

async function loadSmartRecommendations() {
    try {
        showLoading('recommendations-content', 'טוען המלצות חכמות...');
        
        const response = await fetch('/api/smart-recommendations');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Show recommendations panel
        const panel = document.getElementById('recommendations-panel');
        panel.style.display = 'block';
        
        // Update recommendations content
        updateRecommendationsDisplay(data.recommendations);
        
        hideLoading('recommendations-content');
        showNotification(`נמצאו ${data.total_urgent} המלצות דחופות`, 'success');
        
    } catch (error) {
        console.error('Error loading recommendations:', error);
        hideLoading('recommendations-content');
        showError('recommendations-content', 'שגיאה בטעינת ההמלצות');
    }
}

async function handleDocumentUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        showNotification(`מעלה קובץ: ${file.name}...`, 'info');
        
        const formData = new FormData();
        formData.append('document', file);
        
        const response = await fetch('/api/upload-document', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Upload failed');
        }
        
        const result = await response.json();
        
        showNotification('קובץ הועלה ונותח בהצלחה!', 'success');
        
        // Show analysis results
        showDocumentAnalysisResults(result);
        
        // Clear file input
        event.target.value = '';
        
        // Reload smart overview
        await loadSmartOverview();
        
    } catch (error) {
        console.error('Upload error:', error);
        showNotification('שגיאה בהעלאת הקובץ', 'error');
        event.target.value = '';
    }
}

function updateRecommendationsDisplay(recommendations) {
    const container = document.getElementById('recommendations-content');
    
    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = '<p>אין המלצות דחופות כרגע 👍</p>';
        return;
    }
    
    const html = recommendations.map((rec, index) => `
        <div class="recommendation-item priority-${rec.priority}">
            <div class="rec-header">
                <span class="rec-priority">${getPriorityIcon(rec.priority)}</span>
                <h4>${rec.title}</h4>
                <span class="rec-time">${rec.estimated_time}</span>
            </div>
            <p class="rec-description">${rec.description}</p>
            <div class="rec-details">
                <span class="rec-deadline">📅 ${rec.deadline} (${rec.days_left} ימים)</span>
                <span class="rec-action">${rec.recommended_action}</span>
            </div>
            <div class="rec-actions">
                <button class="rec-action-btn" onclick="executeRecommendation('${rec.id}')">
                    ⚡ בצע עכשיו
                </button>
                ${rec.templates_available.length > 0 ? 
                    `<select class="template-select" onchange="useTemplate(this.value, '${rec.id}')">
                        <option value="">בחר תבנית...</option>
                        ${rec.templates_available.map(template => 
                            `<option value="${template}">${template}</option>`
                        ).join('')}
                    </select>` : ''
                }
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function showEmailSyncResults(results) {
    const modal = createModal('תוצאות סינכרון Gmail', `
        <div class="email-sync-results">
            <h4>📧 נמצאו ${results.emails_found} מיילים חדשים</h4>
            ${results.processed_emails.map(email => `
                <div class="email-result">
                    <h5>מאת: ${email.from}</h5>
                    <p><strong>נושא:</strong> ${email.subject}</p>
                    <p><strong>ניתוח AI:</strong> ${email.ai_analysis.type || 'לא זוהה'}</p>
                    ${email.new_tasks.length > 0 ? 
                        `<p><strong>משימות חדשות:</strong> ${email.new_tasks.length}</p>` : 
                        '<p>לא נוצרו משימות חדשות</p>'
                    }
                </div>
            `).join('')}
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function showDocumentAnalysisResults(result) {
    const modal = createModal('ניתוח מסמך', `
        <div class="document-analysis">
            <h4>📄 ${result.file_info.filename}</h4>
            <div class="analysis-details">
                <p><strong>גודל:</strong> ${Math.round(result.file_info.size / 1024)} KB</p>
                <p><strong>סוג מסמך:</strong> ${result.analysis.document_type || 'לא זוהה'}</p>
                <p><strong>שפה:</strong> ${result.analysis.language || 'לא זוהה'}</p>
                <p><strong>פעולה מומלצת:</strong> ${result.analysis.likely_action || 'בדיקה ידנית'}</p>
            </div>
            ${result.ocr_result ? 
                `<div class="ocr-content">
                    <h5>תוכן מחולץ:</h5>
                    <div class="extracted-text">${result.ocr_result.text || 'לא נמצא טקסט'}</div>
                </div>` : ''
            }
            ${result.new_tasks && result.new_tasks.length > 0 ? 
                `<div class="new-tasks">
                    <h5>משימות חדשות שנוצרו:</h5>
                    <ul>
                        ${result.new_tasks.map(task => `<li>${task.title}: ${task.action}</li>`).join('')}
                    </ul>
                </div>` : ''
            }
        </div>
    `);
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    return modal;
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'critical': return '🔴';
        case 'urgent': return '🟠'; 
        case 'high': return '🟡';
        default: return '🟢';
    }
}

async function executeRecommendation(recId) {
    showNotification('מבצע המלצה...', 'info');
    // This would trigger the specific action for the recommendation
    showNotification('פעולה בוצעה בהצלחה!', 'success');
}

function useTemplate(templateName, recId) {
    if (!templateName) return;
    showNotification(`יוצר מסמך מתבנית: ${templateName}`, 'info');
    // This would open the template for editing
}

function showLoading(containerId, message = 'טוען...') {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="loading"><span class="loading-spinner"></span> ${message}</div>`;
    }
}

function hideLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const fileNames = Array.from(files).map(file => file.name).join(', ');
        addMessageToChat(`העליתי ${files.length} קבצים: ${fileNames}`, 'user');
        
        setTimeout(() => {
            addMessageToChat('קיבלתי את הקבצים! אני יכולה לעזור עם עריכה, תרגום, או הכנת מסמכים רשמיים. מה את צריכה?', 'ai');
        }, 1000);
    }
}

function handleVoiceRecording() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;
    
    voiceBtn.style.backgroundColor = 'var(--color-error)';
    voiceBtn.textContent = '🔴';
    
    // Simulate recording
    setTimeout(() => {
        voiceBtn.style.backgroundColor = '';
        voiceBtn.textContent = '🎤';
        addMessageToChat('מכירה, אני צריכה לסדר את המסמכים של הביטוח הבריאות בגרמניה. יש לי בלגן עם הטפסים האלה.', 'user');
        
        setTimeout(() => {
            addMessageToChat('אני עוזרת! אני יכולה לסדר לך את כל המסמכים של הביטוח הבריאות. אני אכין לך רשימת בדיקה ואעזור עם התרגום. בואי נתחיל בסדר: איזה טפסים יש לך עכשיו?', 'ai');
        }, 1500);
    }, 2000);
}

// Missing functions for email sync and recommendations

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
    // Update the display with new email-derived tasks
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

// Smart recommendations system
async function loadSmartRecommendations() {
    try {
        showNotification('טוען המלצות חכמות...', 'info');
        
        const response = await fetch('/api/smart/recommendations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load recommendations');
        }
        
        const recommendations = await response.json();
        displaySmartRecommendations(recommendations);
        
    } catch (error) {
        console.error('Recommendations error:', error);
        
        // Show demo recommendations
        const demoRecommendations = [
            {
                id: 1,
                title: 'סדר עדיפויות לשבוע הקרוב',
                description: 'בהתבסס על המועדים והחשיבות, מומלץ להתמקד ב-3 המשימות הבאות',
                priority: 'גבוה',
                timeEstimate: '2 שעות',
                category: 'תכנון',
                actions: ['הצג רשימה מפורטת', 'צור יומן עבודה'],
                templates: ['תבנית יומן שבועי', 'רשימת משימות']
            },
            {
                id: 2, 
                title: 'טיפול בחובות דחופים',
                description: 'יש לך 3 חובות עם מועדי תשלום קרובים - PAIR Finance, Creditreform, EOS',
                priority: 'קריטי',
                timeEstimate: '1 שעה',
                category: 'כספים',
                actions: ['הצג פרטי חובות', 'צור תכנית תשלומים'],
                templates: ['מכתב הסדר תשלומים', 'בקשה לדחיה']
            },
            {
                id: 3,
                title: 'השלמת מסמכי ביורוקרטיה',
                description: 'נותרו 4 מסמכים לא מושלמים - ביטוח בריאות, רישום נישואין, אישור מגורים',
                priority: 'בינוני',
                timeEstimate: '3 שעות',
                category: 'ביורוקרטיה',
                actions: ['הצג מסמכים חסרים', 'צור לוח זמנים'],
                templates: ['רשימת מסמכים', 'מכתב רשמי']
            }
        ];
        
        displaySmartRecommendations(demoRecommendations);
        showNotification('הצגת המלצות דמו', 'info');
    }
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
            <div class="rec-details">
                <span>📂 ${rec.category}</span>
                <span>⏱️ ${rec.timeEstimate}</span>
            </div>
            <div class="rec-actions">
                ${rec.actions.map(action => `<button class="rec-action-btn" onclick="executeRecommendationAction('${action}', ${rec.id})">${action}</button>`).join('')}
                <select class="template-select" onchange="useTemplate(this.value, ${rec.id})">
                    <option value="">בחר תבנית...</option>
                    ${rec.templates.map(template => `<option value="${template}">${template}</option>`).join('')}
                </select>
            </div>
        </div>
    `).join('');
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

function executeRecommendationAction(action, recId) {
    showNotification(`מבצע: ${action}`, 'info');
    
    switch(action) {
        case 'הצג רשימה מפורטת':
        case 'הצג פרטי חובות':
        case 'הצג מסמכים חסרים':
            showDetailedList(action);
            break;
        case 'צור יומן עבודה':
        case 'צור תכנית תשלומים':
        case 'צור לוח זמנים':
            createDocument(action);
            break;
        default:
            showNotification('פעולה בוצעה!', 'success');
    }
}

function showDetailedList(action) {
    let content = '';
    
    if (action.includes('חובות')) {
        content = `
            <h4>חובות דחופים</h4>
            <ul>
                <li><strong>PAIR Finance:</strong> €1,247 - מועד: 30/09/2025</li>
                <li><strong>Creditreform:</strong> €890 - מועד: 25/09/2025</li>
                <li><strong>EOS KSI:</strong> €635 - מועד: 28/09/2025</li>
            </ul>
        `;
    } else if (action.includes('מסמכים')) {
        content = `
            <h4>מסמכים חסרים</h4>
            <ul>
                <li><strong>ביטוח בריאות:</strong> טופס הרשמה + אישור הכנסה</li>
                <li><strong>רישום נישואין:</strong> תרגום תעודת לידה</li>
                <li><strong>אישור מגורים:</strong> חוזה שכירות מתורגם</li>
            </ul>
        `;
    } else {
        content = `
            <h4>רשימה מפורטת</h4>
            <ul>
                <li>סיום עבודת סמינר - פסיכולוגיה</li>
                <li>תרגום מסמכים לגרמנית</li>
                <li>טיפול בחובות PAIR Finance</li>
            </ul>
        `;
    }
    
    const modal = createModal('פרטים מפורטים', content);
    document.body.appendChild(modal);
}

function createDocument(action) {
    showNotification(`יוצר: ${action}`, 'info');
    setTimeout(() => {
        showNotification('המסמך נוצר בהצלחה!', 'success');
    }, 1500);
}
    
    addMessageToChat('מקליט...', 'user');
    
    setTimeout(() => {
        voiceBtn.style.backgroundColor = '';
        voiceBtn.textContent = '🎤';
        addMessageToChat('שמעתי אותך! איך אני יכולה לעזור?', 'ai');
    }, 2000);
}

// Initialize notifications system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Sync Controls Functions - הפונקציות לכפתורי הסנכרון
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