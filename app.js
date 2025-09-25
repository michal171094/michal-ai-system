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
        refreshBtn.addEventListener('click', loadSmartOverview);
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
    
    try {
        const response = await fetch('/api/smart-overview');
        const data = await response.json();
        
        if (data.success) {
            updateSmartOverview(data);
            updateStats(data.stats);
        } else {
            console.error('שגיאה בטעינת הסקירה החכמה');
        }
        
    } catch (error) {
        console.error('שגיאה בחיבור לשרת:', error);
        // Show demo data on error
        showDemoData();
    }
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
            btn.addEventListener('click', () => openSyncModal(module));
        }
    });
}

// Setup modal controls
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
    console.log(`📋 פותח חלון סנכרון למודול: ${module}`);
    
    const modal = document.getElementById('syncModal');
    const title = document.getElementById('syncModalTitle');
    const body = document.getElementById('syncModalBody');
    
    if (!modal || !title || !body) return;
    
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
        const response = await fetch(`/api/sync/${module}`);
        const data = await response.json();
        
        if (data.success) {
            displaySyncUpdates(data.pendingUpdates, module);
        } else {
            showSyncError('שגיאה בטעינת העדכונים');
        }
        
    } catch (error) {
        console.error('שגיאה בטעינת עדכונים:', error);
        showSyncError('שגיאה בחיבור לשרת');
    }
}

// Display sync updates in modal
function displaySyncUpdates(updates, module) {
    const body = document.getElementById('syncModalBody');
    if (!body) return;
    
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
                ${formatUpdateDetails(update.details)}
            </div>
            <div class="sync-update-actions">
                ${getActionButtons(update.action, update.id)}
            </div>
            <div class="sync-timestamp">
                ${formatTimestamp(update.timestamp)}
            </div>
        </div>
    `).join('');
    
    body.innerHTML = `<div class="sync-updates-list">${updatesHtml}</div>`;
}

// Helper functions for sync updates
function getTypeLabel(type) {
    const labels = {
        'new_task': 'משימה חדשה',
        'status_update': 'עדכון סטטוס',
        'deadline_change': 'שינוי דדליין',
        'payment_plan_offer': 'הצעת תשלומים',
        'important_email': 'מייל חשוב',
        'new_inquiry': 'פנייה חדשה'
    };
    return labels[type] || type;
}

function formatUpdateDetails(details) {
    if (!details) return '';
    
    return Object.entries(details)
        .filter(([key]) => key !== 'content_summary')
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('');
}

function getActionButtons(action, updateId) {
    return `
        <button class="sync-action-btn approve" onclick="handleSyncAction('${updateId}', 'approve')">אשר</button>
        <button class="sync-action-btn dismiss" onclick="handleSyncAction('${updateId}', 'dismiss')">התעלם</button>
    `;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('he-IL');
}

// Handle sync actions
async function handleSyncAction(updateId, action) {
    console.log(`⚡ מבצע פעולה: ${action} על עדכון ${updateId}`);
    
    try {
        const response = await fetch('/api/sync/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updateId, action })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Remove the update from display
            const updateItem = document.querySelector(`[data-id="${updateId}"]`);
            if (updateItem) {
                updateItem.remove();
                
                // Check if no more updates
                const remaining = document.querySelectorAll('.sync-update-item');
                if (remaining.length === 0) {
                    displaySyncUpdates([], '');
                }
            }
            
            showNotification('פעולה בוצעה בהצלחה!', 'success');
            loadSyncBadges();
            
        } else {
            showNotification('שגיאה בביצוע הפעולה', 'error');
        }
        
    } catch (error) {
        console.error('שגיאה בביצוע פעולה:', error);
        showNotification('שגיאה בחיבור לשרת', 'error');
    }
}

// Close sync modal
function closeSyncModal() {
    const modal = document.getElementById('syncModal');
    if (modal) modal.classList.remove('show');
}

// Show sync error
function showSyncError(message) {
    const body = document.getElementById('syncModalBody');
    if (body) {
        body.innerHTML = `
            <div class="sync-no-updates">
                <div class="icon">❌</div>
                <h4>שגיאה</h4>
                <p>${message}</p>
            </div>
        `;
    }
}

// Load sync badges
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
                        if (count > 0) {
                            button.classList.add('has-updates');
                        } else {
                            button.classList.remove('has-updates');
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`שגיאה בטעינת תג ${module}:`, error);
        }
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    console.log(`🔔 הודעה ${type}: ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Make functions available globally
window.handleSyncAction = handleSyncAction;
window.handleTaskAction = handleTaskAction;

console.log('✅ מיכל AI - מערכת עוזרת אישית מוכנה לעבודה! 🚀');