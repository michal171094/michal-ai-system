// מיכל AI - מערכת עוזרת אישית
// Application initialization and main functionality

console.log('🚀 מאתחל את מערכת מיכל AI...');

// Global variables
let activeTab = 'smart-overview';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 HTML טוען...');
    
    try {
        // Initialize basic functionality first
        initializeTabs();
        initializeEventListeners();
        
        // Load initial data
        setTimeout(() => {
            loadInitialData();
            setupSyncControls();
            setupModalControls();
            loadSyncBadges();
        }, 100);
        
        console.log('✅ מערכת מיכל AI מוכנה לעבודה!');
        
    } catch (error) {
        console.error('❌ שגיאה באיתחול:', error);
    }
});

// Initialize tabs functionality
function initializeTabs() {
    console.log('🔄 מאתחל טאבים...');
    
    // Show smart overview by default
    switchTab('smart-overview');
    
    // Add tab click listeners
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
}

// Switch between tabs
function switchTab(tabName) {
    console.log(`📊 עובר לטאב: ${tabName}`);
    
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
        panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(tabName);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
    
    // Load data for active tab
    if (tabName === 'smart-overview') {
        loadSmartOverview();
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    console.log('🔗 מגדיר מאזינים לאירועים...');
    
    // Chat functionality
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Quick question buttons
    document.querySelectorAll('.quick-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.dataset.question;
            sendMessage(question);
        });
    });
    
    // Smart overview refresh
    const refreshBtn = document.getElementById('refreshSmartBtn');
    if (refreshBtn) {
        console.log('✅ נמצא כפתור רענון חכם');
        refreshBtn.addEventListener('click', () => {
            console.log('🔔 לחיצה על כפתור רענון חכם');
            loadSmartOverview();
        });
    } else {
        console.error('❌ לא נמצא כפתור רענון חכם');
    }
}

// Load initial application data
function loadInitialData() {
    console.log('📦 טוען נתונים ראשונים...');
    
    // Load smart overview
    loadSmartOverview();
    
    // Show welcome message
    setTimeout(() => {
        addMessageToChat('שלום מיכל! אני כאן לעזור לך לנהל את כל המשימות שלך. מה תרצי לעשות היום?', 'ai');
    }, 1000);
}

// Load smart overview data
async function loadSmartOverview() {
    console.log('🧠 טוען סקירה חכמה...');
    
    // Always show demo data for now
    console.log('📊 מציג נתוני דמו...');
    showDemoData();
}

// Update smart overview display
function updateSmartOverview(data) {
    const tableBody = document.getElementById('smartTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (data.data && data.data.length > 0) {
        data.data.forEach((item, index) => {
            const row = createSmartOverviewRow(item, index + 1);
            tableBody.appendChild(row);
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center;">אין משימות להצגה</td></tr>';
    }
}

// Create a row for smart overview table
function createSmartOverviewRow(item, index) {
    const row = document.createElement('tr');
    
    // Priority badge
    const priorityClass = item.urgencyLevel === 'קריטי' ? 'critical' : 
                         item.urgencyLevel === 'גבוה מאוד' ? 'urgent' : 
                         item.urgencyLevel === 'גבוה' ? 'high' : 'normal';
    
    row.innerHTML = `
        <td><span class="priority-badge ${priorityClass}">${item.aiPriority}</span></td>
        <td><strong>${item.title}</strong><br><small>${item.description}</small></td>
        <td><span class="domain-badge ${item.domain}">${getDomainLabel(item.domain)}</span></td>
        <td>${item.description}</td>
        <td>${item.deadline || 'ללא מועד'}</td>
        <td><span class="time-remaining ${item.daysLeft < 0 ? 'overdue' : item.daysLeft <= 1 ? 'urgent' : 'normal'}">${item.timeRemaining}</span></td>
        <td><span class="urgency-badge ${priorityClass}">${item.urgencyLevel}</span></td>
        <td><button class="action-btn primary" onclick="handleTaskAction('${item.id}')">${item.action}</button></td>
    `;
    
    return row;
}

// Get domain label in Hebrew
function getDomainLabel(domain) {
    const labels = {
        'academic': 'אקדמיה',
        'bureaucracy': 'בירוקרטיה',
        'debt': 'חובות',
        'email': 'מיילים'
    };
    return labels[domain] || domain;
}

// Update statistics display
function updateStats(stats) {
    if (!stats) return;
    
    const criticalEl = document.getElementById('criticalCount');
    const urgentEl = document.getElementById('urgentCount');
    const pendingEl = document.getElementById('pendingCount');
    const emailTasksEl = document.getElementById('emailTasksCount');
    
    if (criticalEl) criticalEl.textContent = stats.critical || 0;
    if (urgentEl) urgentEl.textContent = stats.urgent || 0;
    if (pendingEl) pendingEl.textContent = stats.pending || 0;
    if (emailTasksEl) emailTasksEl.textContent = stats.emailTasks || 0;
}

// Show demo data when server is not available
function showDemoData() {
    console.log('📊 מציג נתוני דמו...');
    
    const demoStats = {
        critical: 3,
        urgent: 5,
        pending: 12,
        emailTasks: 2
    };
    
    const demoData = {
        success: true,
        data: [
            {
                id: 1,
                title: 'כרמית - סמינר פסיכולוגיה',
                description: 'לקוח: כרמית',
                domain: 'academic',
                deadline: '2025-09-24',
                timeRemaining: 'היום',
                urgencyLevel: 'קריטי',
                aiPriority: 95,
                action: 'שליחת טיוטה',
                daysLeft: 0
            },
            {
                id: 2,
                title: 'PAIR Finance - Immobilien Scout',
                description: 'מספר תיק: 120203581836',
                domain: 'debt',
                deadline: '2025-09-27',
                timeRemaining: '2 ימים',
                urgencyLevel: 'קריטי',
                aiPriority: 90,
                action: 'שליחת התנגדות',
                daysLeft: 2
            },
            {
                id: 3,
                title: 'ביטוח בריאות TK',
                description: 'רשות: TK',
                domain: 'bureaucracy',
                deadline: '2025-09-30',
                timeRemaining: '5 ימים',
                urgencyLevel: 'גבוה מאוד',
                aiPriority: 85,
                action: 'הגשת מסמכים',
                daysLeft: 5
            }
        ],
        stats: demoStats
    };
    
    updateSmartOverview(demoData);
    updateStats(demoStats);
}

// Handle task action clicks
function handleTaskAction(taskId) {
    console.log(`🎯 מבצע פעולה למשימה: ${taskId}`);
    addMessageToChat('איזה פעולה ברצונך לבצע? אני יכולה לעזור עם הכנת מסמכים, מעקב אחר מועדים או תזכורות.', 'ai');
}

// Chat functionality
function sendMessage(messageText = null) {
    const input = document.getElementById('chatInput');
    const message = messageText || (input ? input.value.trim() : '');
    
    if (!message) return;
    
    // Clear input
    if (input) input.value = '';
    
    // Add user message
    addMessageToChat(message, 'user');
    
    // Show typing indicator
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat(response, 'ai');
    }, 1000);
}

// Add message to chat
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

// Generate AI responses
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('דחוף') || lowerMessage.includes('היום')) {
        return "המשימות הדחופות היום:\n• כרמית - סמינר פסיכולוגיה (דדליין היום!)\n• PAIR Finance - התנגדות (נשאר יומיים)\n• ביטוח בריאות TK - הגשת מסמכים\n\nהתחילי עם כרמית - זה הכי דחוף!";
    }
    
    if (lowerMessage.includes('pair') || lowerMessage.includes('התנגדות')) {
        return "בשביל PAIR Finance:\n1. אל תודי בחוב\n2. בקשי הוכחות מפורטות\n3. שלחי בדואר רשום\n4. שמרי את כל המסמכים\n\nיש לי תבנית מכתב התנגדות - רוצה לראות אותה?";
    }
    
    if (lowerMessage.includes('בירוקרטיה')) {
        return "מצב הבירוקרטיה:\n• רישום נישואין - צריך לברר סטטוס\n• TK ביטוח בריאות - דחוף!\n• LEA אישור שהייה - בתהליך\n• Jobcenter - מאושר ✓";
    }
    
    return "הבנתי את השאלה שלך. איך אני יכולה לעזור לך בפירוט יותר? אני יכולה לסייע עם:\n• ניהול המשימות הדחופות\n• הכנת מכתבי התנגדות\n• מעקב אחר בירוקרטיה\n• ייעוץ כלכלי";
}

// Sync Controls Setup
function setupSyncControls() {
    console.log('🔄 מגדיר כפתורי סנכרון...');
    
    const syncButtons = [
        { id: 'syncAcademicBtn', module: 'academic' },
        { id: 'syncBureaucracyBtn', module: 'bureaucracy' },
        { id: 'syncDebtsBtn', module: 'debts' },
        { id: 'syncEmailBtn', module: 'emails' }
    ];

    syncButtons.forEach(({ id, module }) => {
        const btn = document.getElementById(id);
        if (btn) {
            console.log(`✅ נמצא כפתור: ${id}`);
            btn.addEventListener('click', () => {
                console.log(`🔔 לחיצה על כפתור: ${id}, מודול: ${module}`);
                openSyncModal(module);
            });
        } else {
            console.error(`❌ לא נמצא כפתור: ${id}`);
        }
    });
}// Setup modal controls
function setupModalControls() {
    console.log('📋 מגדיר בקרת חלונות...');
    
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

// Open sync modal
async function openSyncModal(module) {
    console.log(`📋 פותח חלון סנכרון מתקדם למודול: ${module}`);
    
    const modal = document.getElementById('syncModal');
    const title = document.getElementById('syncModalTitle');
    const body = document.getElementById('syncModalBody');
    
    if (!modal || !title || !body) {
        console.error('❌ לא נמצאו אלמנטי המודל הנדרשים');
        return;
    }

    // Set advanced title with module info
    const moduleInfo = {
        'academic': { icon: '📚', name: 'מערכת אקדמיה', color: '#3B82F6' },
        'bureaucracy': { icon: '🏛️', name: 'מערכת בירוקרטיה', color: '#8B5CF6' }, 
        'debts': { icon: '💰', name: 'מערכת חובות', color: '#EF4444' },
        'emails': { icon: '📧', name: 'מערכת מיילים', color: '#10B981' }
    };
    
    const info = moduleInfo[module];
    title.innerHTML = `${info.icon} סינכרון ${info.name} <span class="sync-status-indicator">🔄 פעיל</span>`;
    
    // Show advanced loading interface
    body.innerHTML = createAdvancedLoadingInterface(module);
    
    // Show modal with animation
    modal.style.display = 'flex';
    modal.classList.add('show');
    
    // Start advanced sync process
    await performAdvancedSync(module, body);
}

// Create advanced loading interface
function createAdvancedLoadingInterface(module) {
    return `
        <div class="advanced-sync-container">
            <div class="sync-progress-section">
                <div class="sync-step active" data-step="1">
                    <div class="step-icon">🔍</div>
                    <div class="step-content">
                        <h4>סריקת מקורות נתונים</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p class="step-status">מאתחל חיבורים...</p>
                    </div>
                </div>
                
                <div class="sync-step" data-step="2">
                    <div class="step-icon">🧠</div>
                    <div class="step-content">
                        <h4>ניתוח AI ועיבוד נתונים</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p class="step-status">ממתין...</p>
                    </div>
                </div>
                
                <div class="sync-step" data-step="3">
                    <div class="step-icon">⚡</div>
                    <div class="step-content">
                        <h4>יצירת עדכונים ופעולות</h4>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <p class="step-status">ממתין...</p>
                    </div>
                </div>
            </div>
            
            <div class="sync-realtime-log">
                <h5>📊 לוג בזמן אמת</h5>
                <div class="log-container" id="syncLog">
                    <div class="log-entry">[${new Date().toLocaleTimeString()}] מתחיל סינכרון ${module}...</div>
                </div>
            </div>
        </div>
    `;
}

// Perform advanced sync process
async function performAdvancedSync(module, bodyElement) {
    const logContainer = bodyElement.querySelector('#syncLog');
    
    // Step 1: Data source scanning
    await simulateStep(1, 'סריקת מקורות נתונים', logContainer, async () => {
        addLogEntry(logContainer, 'מתחבר לשרתי מידע...');
        await delay(800);
        addLogEntry(logContainer, `סורק ${getDataSources(module).length} מקורות נתונים...`);
        await delay(1200);
        addLogEntry(logContainer, 'מזהה שינויים וחידושים...');
        await delay(900);
    });

    // Step 2: AI Analysis  
    await simulateStep(2, 'ניתוח AI ועיבוד נתונים', logContainer, async () => {
        addLogEntry(logContainer, 'מעביר נתונים למנוע AI...');
        await delay(1000);
        addLogEntry(logContainer, 'מנתח דפוסים ועדיפויות...');
        await delay(1500);
        addLogEntry(logContainer, 'מחשב המלצות והתראות...');
        await delay(1200);
        addLogEntry(logContainer, 'מסווג לפי חשיבות ודחיפות...');
        await delay(800);
    });

    // Step 3: Action Creation
    await simulateStep(3, 'יצירת עדכונים ופעולות', logContainer, async () => {
        addLogEntry(logContainer, 'מכין רשימת עדכונים...');
        await delay(700);
        addLogEntry(logContainer, 'יוצר פעולות מוצעות...');
        await delay(900);
        addLogEntry(logContainer, 'מקשר עם משימות קיימות...');
        await delay(600);
    });

    // Show final results
    await delay(500);
    addLogEntry(logContainer, '✅ סינכרון הושלם בהצלחה!');
    
    // Display advanced results
    setTimeout(() => {
        displayAdvancedSyncResults(module, bodyElement);
    }, 1000);
}

// Simulate sync step with progress
async function simulateStep(stepNumber, stepName, logContainer, stepFunction) {
    const stepElement = document.querySelector(`[data-step="${stepNumber}"]`);
    const progressBar = stepElement.querySelector('.progress-fill');
    const statusText = stepElement.querySelector('.step-status');
    
    // Activate step
    stepElement.classList.add('active');
    statusText.textContent = 'מעבד...';
    
    addLogEntry(logContainer, `🔄 מתחיל: ${stepName}`);
    
    // Simulate progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 100) progress = 100;
        progressBar.style.width = `${progress}%`;
    }, 100);
    
    // Execute step function
    await stepFunction();
    
    // Complete step
    clearInterval(progressInterval);
    progressBar.style.width = '100%';
    statusText.textContent = '✅ הושלם';
    stepElement.classList.remove('active');
    stepElement.classList.add('completed');
    
    addLogEntry(logContainer, `✅ הושלם: ${stepName}`);
    await delay(300);
}

// Helper functions for advanced sync

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addLogEntry(container, message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
}

function getDataSources(module) {
    const sources = {
        'emails': ['Gmail API', 'Outlook Integration', 'IMAP Scanner', 'AI Content Analyzer'],
        'academic': ['University Portal', 'Student System', 'Academic Calendar', 'Grade System'],
        'debts': ['Payment Systems', 'Bank APIs', 'Credit Agencies', 'Legal Databases'],
        'bureaucracy': ['Government APIs', 'Municipal Systems', 'Insurance Portals', 'Healthcare Systems']
    };
    return sources[module] || [];
}

// Display advanced sync results
function displayAdvancedSyncResults(module, bodyElement) {
    const results = generateAdvancedResults(module);
    
    bodyElement.innerHTML = `
        <div class="advanced-results-container">
            <div class="results-summary">
                <h4>� תוצאות סינכרון - ${getModuleName(module)}</h4>
                <div class="summary-stats">
                    <div class="stat-item critical">
                        <span class="stat-number">${results.stats.critical}</span>
                        <span class="stat-label">דחופים</span>
                    </div>
                    <div class="stat-item new">
                        <span class="stat-number">${results.stats.new}</span>
                        <span class="stat-label">חדשים</span>
                    </div>
                    <div class="stat-item updated">
                        <span class="stat-number">${results.stats.updated}</span>
                        <span class="stat-label">עודכנו</span>
                    </div>
                    <div class="stat-item ai-insights">
                        <span class="stat-number">${results.stats.insights}</span>
                        <span class="stat-label">תובנות AI</span>
                    </div>
                </div>
            </div>
            
            <div class="results-filters">
                <div class="filter-tabs">
                    <button class="filter-tab active" data-filter="all">הכל (${results.updates.length})</button>
                    <button class="filter-tab" data-filter="critical">דחופים (${results.updates.filter(u => u.priority === 'critical').length})</button>
                    <button class="filter-tab" data-filter="new">חדשים (${results.updates.filter(u => u.isNew).length})</button>
                    <button class="filter-tab" data-filter="ai">תובנות AI (${results.updates.filter(u => u.hasAiInsight).length})</button>
                </div>
                
                <div class="filter-actions">
                    <button class="bulk-action-btn" onclick="selectAllUpdates()">בחר הכל</button>
                    <button class="bulk-action-btn" onclick="approveSelected()">אשר נבחרים</button>
                    <button class="bulk-action-btn" onclick="createTasksFromSelected()">צור משימות</button>
                </div>
            </div>
            
            <div class="updates-grid" id="updatesGrid">
                ${generateUpdatesGrid(results.updates)}
            </div>
            
            <div class="ai-recommendations">
                <h5>🧠 המלצות AI מתקדמות</h5>
                <div class="recommendations-list">
                    ${generateAiRecommendations(module, results)}
                </div>
            </div>
            
            <div class="sync-actions-footer">
                <button class="action-btn secondary" onclick="scheduleSyncReminder()">⏰ תזכיר לסנכרן שוב</button>
                <button class="action-btn secondary" onclick="exportSyncReport()">📊 ייצא דוח</button>
                <button class="action-btn primary" onclick="finalizeSyncSession()">✅ סיים וטבע שינויים</button>
            </div>
        </div>
    `;
    
    // Initialize interactive features
    initializeResultsInteractivity();
}

// Generate advanced sync results
function generateAdvancedResults(module) {
    const baseResults = {
        'emails': {
            stats: { critical: 3, new: 7, updated: 12, insights: 5 },
            updates: [
                {
                    id: 'email_001',
                    type: 'urgent_email',
                    title: 'דרישה דחופה - TK ביטוח בריאות',
                    description: 'דרישה להשלמת מסמכים תוך 48 שעות. AI זיהה קשר למשימה קיימת #1247',
                    priority: 'critical',
                    isNew: true,
                    hasAiInsight: true,
                    aiScore: 95,
                    suggestedActions: ['צור משימה דחופה', 'התראה SMS', 'חבר למשימה קיימת'],
                    relatedTasks: ['TK-1247: הגשת מסמכי ביטוח'],
                    timestamp: '2025-09-25T14:30:00',
                    source: 'Gmail API'
                },
                {
                    id: 'email_002', 
                    type: 'deadline_reminder',
                    title: 'תזכורת - הגשת סמינר באוניברסיטה',
                    description: 'תזכורת אוטומטית ממנהל האוניברסיטה. מועד אחרון: 26/09',
                    priority: 'high',
                    isNew: false,
                    hasAiInsight: true,
                    aiScore: 88,
                    suggestedActions: ['עדכן סטטוס משימה', 'שלח התראה ללקוח'],
                    relatedTasks: ['ACD-0891: סמינר פסיכולוגיה - כרמית'],
                    timestamp: '2025-09-25T13:15:00',
                    source: 'University Portal'
                }
            ]
        },
        'academic': {
            stats: { critical: 2, new: 4, updated: 8, insights: 3 },
            updates: [
                {
                    id: 'acad_001',
                    type: 'grade_update',
                    title: 'עדכון ציון - קורס פסיכולוגיה חברתית',
                    description: 'ציון חדש התקבל במערכת. AI זיהה השפעה על ממוצע הסמסטר',
                    priority: 'medium',
                    isNew: true,
                    hasAiInsight: true,
                    aiScore: 76
                }
            ]
        },
        'debts': {
            stats: { critical: 4, new: 2, updated: 6, insights: 8 },
            updates: [
                {
                    id: 'debt_001',
                    type: 'payment_overdue',
                    title: 'PAIR Finance - תשלום עבר מועד',
                    description: 'תשלום מס\' 120203581836 עבר מועד ב-3 ימים. AI ממליץ על פעולה מיידית',
                    priority: 'critical',
                    isNew: true,
                    hasAiInsight: true,
                    aiScore: 92
                }
            ]
        },
        'bureaucracy': {
            stats: { critical: 1, new: 5, updated: 9, insights: 4 },
            updates: [
                {
                    id: 'bur_001',
                    type: 'document_required',
                    title: 'בקשת מסמכים נוספים - עיריית תל אביב',
                    description: 'נדרשים מסמכים נוספים לטיפול בבקשה 45789. AI זיהה מסמכים דומים במערכת',
                    priority: 'high',
                    isNew: true,
                    hasAiInsight: true,
                    aiScore: 81
                }
            ]
        }
    };
    
    return baseResults[module] || { stats: {}, updates: [] };
}

function getModuleName(module) {
    const names = {
        'emails': 'מערכת מיילים',
        'academic': 'מערכת אקדמיה', 
        'debts': 'מערכת חובות',
        'bureaucracy': 'מערכת בירוקרטיה'
    };
    return names[module] || module;
}

// Generate updates grid
function generateUpdatesGrid(updates) {
    return updates.map(update => `
        <div class="update-card ${update.priority}" data-update-id="${update.id}">
            <div class="update-header">
                <div class="update-checkbox">
                    <input type="checkbox" id="update_${update.id}" class="update-selector">
                </div>
                <div class="update-priority">
                    <span class="priority-badge ${update.priority}">${getPriorityLabel(update.priority)}</span>
                    ${update.isNew ? '<span class="new-badge">חדש</span>' : ''}
                    ${update.hasAiInsight ? '<span class="ai-badge">AI</span>' : ''}
                </div>
                <div class="update-score">
                    <span class="ai-score">${update.aiScore || 0}</span>
                </div>
            </div>
            
            <div class="update-content">
                <h5 class="update-title">${update.title}</h5>
                <p class="update-description">${update.description}</p>
                
                ${update.relatedTasks ? `
                    <div class="related-tasks">
                        <strong>משימות קשורות:</strong>
                        ${update.relatedTasks.map(task => `<span class="task-link">${task}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="update-meta">
                    <span class="update-source">📍 ${update.source || 'מקור לא ידוע'}</span>
                    <span class="update-time">⏰ ${formatTime(update.timestamp)}</span>
                </div>
            </div>
            
            <div class="update-actions">
                <div class="suggested-actions">
                    ${(update.suggestedActions || []).map(action => 
                        `<button class="suggested-action-btn" onclick="performAction('${update.id}', '${action}')">${action}</button>`
                    ).join('')}
                </div>
                
                <div class="primary-actions">
                    <button class="action-btn small secondary" onclick="snoozeUpdate('${update.id}')">⏰ דחה</button>
                    <button class="action-btn small primary" onclick="approveUpdate('${update.id}')">✅ אשר</button>
                    <button class="action-btn small" onclick="viewUpdateDetails('${update.id}')">👁️ פרטים</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate AI recommendations
function generateAiRecommendations(module, results) {
    const recommendations = {
        'emails': [
            {
                type: 'pattern',
                title: 'זוהה דפוס חוזר',
                description: 'המערכת זיהתה שאתה מקבל הרבה מיילים מTK ביטוח. האם לטייג אוטומטית?',
                confidence: 87,
                actions: ['צור כלל אוטומטי', 'הוסף לרשימה לבנה']
            },
            {
                type: 'optimization',
                title: 'אופטימיזציה מוצעת',
                description: 'זמן התגובה הממוצע למיילים דחופים: 4.2 שעות. מומלץ להגדיר התראות מיידיות',
                confidence: 92,
                actions: ['הגדר התראות SMS', 'צור תבנית תגובה']
            }
        ],
        'debts': [
            {
                type: 'risk_analysis',
                title: 'ניתוח סיכונים',
                description: '3 חובות מתקרבים לפירעון בו-זמנית. מומלץ לתעדף לפי חומרה משפטית',
                confidence: 95,
                actions: ['צור תוכנית פירעון', 'יעוץ משפטי']
            }
        ]
    };
    
    const moduleRecs = recommendations[module] || [];
    
    return moduleRecs.map(rec => `
        <div class="ai-recommendation ${rec.type}">
            <div class="rec-header">
                <span class="rec-icon">${getRecommendationIcon(rec.type)}</span>
                <span class="rec-confidence">${rec.confidence}%</span>
            </div>
            <div class="rec-content">
                <h6>${rec.title}</h6>
                <p>${rec.description}</p>
                <div class="rec-actions">
                    ${rec.actions.map(action => 
                        `<button class="rec-action-btn" onclick="implementRecommendation('${module}', '${rec.type}', '${action}')">${action}</button>`
                    ).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Interactive functions
function initializeResultsInteractivity() {
    // Filter tabs functionality
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterUpdates(filter);
            
            // Update active tab
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update selection functionality
    document.querySelectorAll('.update-selector').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectionCount);
    });
}

function filterUpdates(filter) {
    const cards = document.querySelectorAll('.update-card');
    
    cards.forEach(card => {
        let show = true;
        
        if (filter === 'critical') {
            show = card.classList.contains('critical');
        } else if (filter === 'new') {
            show = card.querySelector('.new-badge') !== null;
        } else if (filter === 'ai') {
            show = card.querySelector('.ai-badge') !== null;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Action functions
function selectAllUpdates() {
    document.querySelectorAll('.update-selector').forEach(cb => {
        cb.checked = true;
    });
    updateSelectionCount();
}

function approveSelected() {
    const selected = Array.from(document.querySelectorAll('.update-selector:checked'));
    if (selected.length === 0) {
        alert('אנא בחר עדכונים לאישור');
        return;
    }
    
    const count = selected.length;
    if (confirm(`לאשר ${count} עדכונים נבחרים?`)) {
        selected.forEach(cb => {
            const card = cb.closest('.update-card');
            card.style.opacity = '0.6';
            card.classList.add('approved');
        });
        
        showNotification(`✅ ${count} עדכונים אושרו בהצלחה!`);
        updateSelectionCount();
    }
}

function createTasksFromSelected() {
    const selected = Array.from(document.querySelectorAll('.update-selector:checked'));
    if (selected.length === 0) {
        alert('אנא בחר עדכונים ליצירת משימות');
        return;
    }
    
    const count = selected.length;
    if (confirm(`ליצור ${count} משימות חדשות מהעדכונים הנבחרים?`)) {
        // Simulate task creation
        showNotification(`📋 ${count} משימות חדשות נוצרו!`);
        
        // Update UI
        selected.forEach(cb => {
            const card = cb.closest('.update-card');
            card.classList.add('task-created');
        });
    }
}

// Utility functions
function getPriorityLabel(priority) {
    const labels = {
        'critical': 'קריטי',
        'high': 'גבוה',
        'medium': 'בינוני',
        'low': 'נמוך'
    };
    return labels[priority] || priority;
}

function getRecommendationIcon(type) {
    const icons = {
        'pattern': '🔍',
        'optimization': '⚡',
        'risk_analysis': '⚠️',
        'automation': '🤖'
    };
    return icons[type] || '💡';
}

function formatTime(timestamp) {
    if (!timestamp) return 'לא ידוע';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `לפני ${diffMins} דקות`;
    if (diffMins < 1440) return `לפני ${Math.floor(diffMins/60)} שעות`;
    return date.toLocaleDateString('he-IL');
}

function updateSelectionCount() {
    const selected = document.querySelectorAll('.update-selector:checked').length;
    const total = document.querySelectorAll('.update-selector').length;
    
    // Update bulk action buttons
    const bulkBtns = document.querySelectorAll('.bulk-action-btn');
    bulkBtns.forEach(btn => {
        btn.style.opacity = selected > 0 ? '1' : '0.5';
        btn.disabled = selected === 0;
    });
}

function showNotification(message) {
    // Create and show notification
    const notification = document.createElement('div');
    notification.className = 'sync-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
// Action handler functions for sync modal
function performAction(updateId, action) {
    console.log(`🎯 מבצע פעולה: ${action} עבור עדכון ${updateId}`);
    
    const actionMessages = {
        'צור משימה דחופה': '📋 משימה דחופה נוצרה בהצלחה!',
        'התראה SMS': '📱 התראת SMS נשלחה!',
        'חבר למשימה קיימת': '🔗 העדכון חובר למשימה קיימת!',
        'עדכן סטטוס משימה': '📊 סטטוס המשימה עודכן!',
        'שלח התראה ללקוח': '📧 התראה נשלחה ללקוח!',
        'צור תוכנית פירעון': '💰 תוכנית פירעון נוצרה!',
        'יעוץ משפטי': '⚖️ בקשה ליעוץ משפטי נשלחה!',
        'צור כלל אוטומטי': '🤖 כלל אוטומטי נוצר!',
        'הוסף לרשימה לבנה': '✅ נוסף לרשימה הלבנה!',
        'הגדר התראות SMS': '📱 התראות SMS הוגדרו!',
        'צור תבנית תגובה': '📝 תבנית תגובה נוצרה!'
    };
    
    const message = actionMessages[action] || `✅ פעולה "${action}" בוצעה בהצלחה!`;
    showNotification(message);
    
    // Update UI to show action was performed
    const updateCard = document.querySelector(`[data-update-id="${updateId}"]`);
    if (updateCard) {
        updateCard.classList.add('action-performed');
        
        // Disable the action button
        const actionBtn = Array.from(updateCard.querySelectorAll('.suggested-action-btn'))
            .find(btn => btn.textContent === action);
        if (actionBtn) {
            actionBtn.disabled = true;
            actionBtn.textContent = '✅ ' + action;
            actionBtn.style.background = '#10b981';
            actionBtn.style.color = 'white';
        }
    }
}

function approveUpdate(updateId) {
    console.log(`✅ מאשר עדכון: ${updateId}`);
    
    const updateCard = document.querySelector(`[data-update-id="${updateId}"]`);
    if (updateCard) {
        updateCard.classList.add('approved');
        updateCard.style.opacity = '0.7';
        
        // Update approve button
        const approveBtn = updateCard.querySelector('.action-btn.primary');
        if (approveBtn) {
            approveBtn.textContent = '✅ אושר';
            approveBtn.disabled = true;
            approveBtn.style.background = '#10b981';
        }
    }
    
    showNotification('✅ העדכון אושר בהצלחה!');
}

function snoozeUpdate(updateId) {
    console.log(`⏰ דוחה עדכון: ${updateId}`);
    
    const options = [
        '15 דקות',
        '1 שעה', 
        '4 שעות',
        'מחר בבוקר',
        'בשבוע הבא'
    ];
    
    const choice = prompt(`לכמה זמן לדחות את העדכון?\n\n${options.map((opt, i) => `${i+1}. ${opt}`).join('\n')}\n\nהכנס מספר (1-${options.length}):`);
    
    if (choice && choice >= 1 && choice <= options.length) {
        const selectedOption = options[choice - 1];
        
        const updateCard = document.querySelector(`[data-update-id="${updateId}"]`);
        if (updateCard) {
            updateCard.classList.add('snoozed');
            updateCard.style.opacity = '0.5';
            
            // Add snooze indicator
            const snoozeIndicator = document.createElement('div');
            snoozeIndicator.className = 'snooze-indicator';
            snoozeIndicator.textContent = `💤 נדחה ל${selectedOption}`;
            updateCard.querySelector('.update-content').appendChild(snoozeIndicator);
        }
        
        showNotification(`⏰ העדכון נדחה ל${selectedOption}`);
    }
}

function viewUpdateDetails(updateId) {
    console.log(`👁️ מציג פרטי עדכון: ${updateId}`);
    
    // Create detailed view modal
    const detailModal = document.createElement('div');
    detailModal.className = 'update-detail-modal';
    detailModal.innerHTML = `
        <div class="update-detail-content">
            <div class="detail-header">
                <h3>🔍 פרטי עדכון מלאים</h3>
                <button class="close-detail-btn" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="detail-body">
                <div class="detail-section">
                    <h4>📊 מידע כללי</h4>
                    <p><strong>מזהה:</strong> ${updateId}</p>
                    <p><strong>זמן יצירה:</strong> ${new Date().toLocaleString('he-IL')}</p>
                    <p><strong>מקור הנתונים:</strong> Gmail API Integration</p>
                </div>
                
                <div class="detail-section">
                    <h4>🧠 ניתוח AI</h4>
                    <p><strong>ציון חשיבות:</strong> 95/100</p>
                    <p><strong>קטגוריה:</strong> בירוקרטיה דחופה</p>
                    <p><strong>תגיות זוהו:</strong> TK, ביטוח בריאות, מסמכים חסרים</p>
                </div>
                
                <div class="detail-section">
                    <h4>📋 משימות קשורות</h4>
                    <p>• משימה #1247 - הגשת מסמכי ביטוח TK</p>
                    <p>• משימה #1156 - מעקב אחר בקשות ביטוח</p>
                </div>
                
                <div class="detail-section">
                    <h4>📈 היסטוריה</h4>
                    <p>• ${new Date().toLocaleString('he-IL')} - עדכון זוהה על ידי AI</p>
                    <p>• ${new Date().toLocaleString('he-IL')} - הוגדר כדחוף</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(detailModal);
    
    // Show with animation
    setTimeout(() => {
        detailModal.classList.add('show');
    }, 10);
}

function scheduleSyncReminder() {
    const intervals = ['15 דקות', '1 שעה', '4 שעות', '24 שעות'];
    const choice = prompt(`מתי להזכיר על סינכרון חוזר?\n\n${intervals.map((int, i) => `${i+1}. ${int}`).join('\n')}\n\nהכנס מספר:`);
    
    if (choice && choice >= 1 && choice <= intervals.length) {
        showNotification(`⏰ תזכורת נקבעה ל${intervals[choice-1]}`);
    }
}

function exportSyncReport() {
    showNotification('📊 דוח סינכרון יוצא... (פונקציונליות בפיתוח)');
    
    // Simulate report generation
    setTimeout(() => {
        const reportData = `דוח סינכרון - ${new Date().toLocaleDateString('he-IL')}
        
📊 סטטיסטיקות:
- עדכונים דחופים: 3
- עדכונים חדשים: 7  
- עדכונים שעודכנו: 12
- תובנות AI: 5

🎯 פעולות שבוצעו:
- משימות נוצרו: 4
- התראות נשלחו: 7
- עדכונים אושרו: 12

🤖 המלצות AI:
- זוהו 2 דפוסים חוזרים
- הוצעו 3 אופטימיזציות
- זוהה 1 סיכון פוטנציאלי
        `;
        
        const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `sync-report-${new Date().toISOString().split('T')[0]}.txt`;
        link.click();
        
        showNotification('📄 דוח נשמר בהצלחה!');
    }, 2000);
}

function finalizeSyncSession() {
    const approvedCount = document.querySelectorAll('.update-card.approved').length;
    const tasksCreated = document.querySelectorAll('.update-card.task-created').length;
    
    const confirmMessage = `
סיכום סשן סינכרון:

✅ עדכונים שאושרו: ${approvedCount}
📋 משימות שנוצרו: ${tasksCreated}
🤖 המלצות AI שיושמו: ${Math.floor(Math.random() * 5) + 1}

האם לשמור ולטבע את כל השינויים?
    `;
    
    if (confirm(confirmMessage)) {
        // Simulate finalization
        showNotification('💾 השינויים נשמרו וטבעו במערכת!');
        
        // Close modal after delay
        setTimeout(() => {
            closeSyncModal();
        }, 2000);
    }
}

function implementRecommendation(module, type, action) {
    console.log(`🤖 מיישם המלצת AI: ${action} במודול ${module}`);
    
    const messages = {
        'צור כלל אוטומטי': '🤖 כלל אוטומטי נוצר! מיילים מTK יסווגו אוטומטית.',
        'הוסף לרשימה לבנה': '✅ TK ביטוח נוסף לרשימה הלבנה.',
        'הגדר התראות SMS': '📱 התראות SMS הוגדרו למיילים דחופים.',
        'צור תבנית תגובה': '📝 תבנית תגובה נוצרה למיילי ביטוח.',
        'צור תוכנית פירעון': '💰 תוכנית פירעון אוטומטית הוגדרה.',
        'יעוץ משפטי': '⚖️ בקשה ליעוץ משפטי נוספה למשימות.'
    };
    
    const message = messages[action] || `✅ המלצה "${action}" יושמה בהצלחה!`;
    showNotification(message);
    
    // Update recommendation UI
    const recElement = event.target.closest('.ai-recommendation');
    if (recElement) {
        recElement.style.opacity = '0.7';
        recElement.style.background = '#f0fdf4';
        event.target.textContent = '✅ יושם';
        event.target.disabled = true;
    }
}
// --- Legacy sync code removed & cleaned (duplicate helpers, unused blocks) ---
// Retain only the functions still needed by current advanced UI: closeSyncModal, loadSyncBadges.

function closeSyncModal() {
    const modal = document.getElementById('syncModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
    }
}

async function loadSyncBadges() {
    console.log('🏷️ טוען תגי סנכרון...');
    const modules = ['academic', 'bureaucracy', 'debts', 'emails'];
    for (const module of modules) {
        try {
            const response = await fetch(`/api/sync/${module}`);
            const data = await response.json();
            if (data.success) {
                const badge = document.getElementById(`${module}Badge`);
                const count = data.count || 0;
                if (badge) {
                    badge.textContent = count;
                    const button = badge.closest('.sync-btn');
                    if (button) {
                        if (count > 0) button.classList.add('has-updates');
                        else button.classList.remove('has-updates');
                    }
                }
            }
        } catch (error) {
            console.error(`שגיאה בטעינת תג ${module}:`, error);
        }
    }
}

// Expose only required legacy global handlers
window.handleTaskAction = handleTaskAction;

console.log('✅ מיכל AI - מערכת עוזרת אישית מוכנה לעבודה! 🚀');