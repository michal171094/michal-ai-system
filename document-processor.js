// Advanced Document Analysis and AI Processing
class DocumentProcessor {
    constructor() {
        this.supportedTypes = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'eml'];
        this.processingQueue = [];
    }

    async processDocument(file) {
        showNotification(`מעבד מסמך: ${file.name}...`, 'info');
        
        try {
            // Simulate OCR and AI analysis
            const analysis = await this.analyzeDocument(file);
            
            // Show approval popup
            return this.showApprovalPopup(analysis);
            
        } catch (error) {
            console.error('Document processing error:', error);
            showNotification('שגיאה בעיבוד המסמך', 'error');
            throw error;
        }
    }

    async analyzeDocument(file) {
        // Simulate advanced AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const fileName = file.name.toLowerCase();
        let analysis = {};
        
        // Intelligent document classification
        if (fileName.includes('pair') || fileName.includes('finance')) {
            analysis = {
                type: 'debt_notice',
                category: 'חובות',
                creditor: 'PAIR Finance',
                amount: '€1,247',
                dueDate: '2025-09-30',
                urgency: 'דחוף',
                extractedText: `
PAIR Finance GmbH
Inkasso-Abteilung

Sehr geehrte Damen und Herren,

hiermit fordern wir Sie letztmalig auf, den offenen Betrag in Höhe von 1.247,00 EUR 
aus der Forderung der Amazon EU S.à r.l. bis zum 30.09.2025 zu begleichen.

Bei Nichtzahlung werden wir rechtliche Schritte einleiten.

Mit freundlichen Grüßen
PAIR Finance Team
                `,
                suggestedActions: [
                    'התקשר ל-PAIR Finance לסידור תשלומים',
                    'בדוק את תקיפות החוב',
                    'הכן מכתב התנגדות אם נדרש'
                ],
                relatedTask: {
                    exists: true,
                    taskId: 1,
                    updates: ['עדכן סכום מדויק', 'עדכן מועד סופי']
                }
            };
        } else if (fileName.includes('standesamt') || fileName.includes('heirat')) {
            analysis = {
                type: 'bureaucracy_document',
                category: 'ביורוקרטיה',
                authority: 'Standesamt Berlin',
                documentType: 'אישור רישום נישואין',
                urgency: 'גבוה',
                extractedText: `
Standesamt Berlin Mitte

Betreff: Eheschließung - Fehlende Unterlagen

Sehr geehrte Damen und Herren,

für die Durchführung Ihrer Eheschließung benötigen wir noch folgende Unterlagen:

1. Geburtsurkunde mit Apostille
2. Ledigkeitsbescheinigung  
3. Reisepass in beglaubigter Kopie

Bitte reichen Sie diese bis zum 30.09.2025 nach.

Mit freundlichen Grüßen
Standesamt Berlin
                `,
                suggestedActions: [
                    'השג תעודת לידה עם אפוסטיל',
                    'הכן אישור רווקות',
                    'צלם דרכון מאושר'
                ],
                relatedTask: {
                    exists: true,
                    taskId: 1,
                    updates: ['עדכן רשימת מסמכים חסרים', 'עדכן מועד הגשה']
                }
            };
        } else if (fileName.includes('aok') || fileName.includes('kranken')) {
            analysis = {
                type: 'health_insurance',
                category: 'ביורוקרטיה',
                authority: 'AOK',
                documentType: 'ביטוח בריאות',
                urgency: 'גבוה',
                extractedText: `
AOK - Die Gesundheitskasse

Willkommen bei der AOK!

Ihre Krankenversicherung wurde erfolgreich beantragt.
Versicherungsnummer: 123456789
Gültigkeit: Ab 01.10.2025

Bitte bewahren Sie dieses Schreiben gut auf.
                `,
                suggestedActions: [
                    'שמור מספר ביטוח',
                    'הזמן כרטיס ביטוח',
                    'עדכן רופא משפחה'
                ],
                relatedTask: {
                    exists: true,
                    taskId: 2,
                    updates: ['עדכן סטטוס לאושר', 'הוסף מספר ביטוח']
                }
            };
        } else {
            // Generic document analysis
            analysis = {
                type: 'general_document',
                category: 'כללי',
                documentType: 'מסמך כללי',
                urgency: 'בינוני',
                extractedText: 'תוכן המסמך זוהה אך דורש בדיקה ידנית',
                suggestedActions: ['בדוק תוכן ידנית', 'קטלג במערכת'],
                relatedTask: {
                    exists: false,
                    suggestedNewTask: {
                        title: `עיבוד מסמך: ${file.name}`,
                        category: 'כללי',
                        priority: 'בינוני'
                    }
                }
            };
        }

        analysis.fileName = file.name;
        analysis.fileSize = file.size;
        analysis.processedAt = new Date().toISOString();
        
        return analysis;
    }

    showApprovalPopup(analysis) {
        return new Promise((resolve) => {
            const modal = this.createApprovalModal(analysis, resolve);
            document.body.appendChild(modal);
        });
    }

    createApprovalModal(analysis, onResolve) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay approval-modal';
        
        modal.innerHTML = `
            <div class="modal-content approval-content">
                <div class="modal-header approval-header">
                    <div class="approval-title">
                        <span class="approval-icon">🤖</span>
                        <h3>אישור עיבוד מסמך חכם</h3>
                    </div>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body approval-body">
                    <div class="document-info">
                        <h4>📄 מידע על המסמך</h4>
                        <div class="info-grid">
                            <div><strong>שם קובץ:</strong> ${analysis.fileName}</div>
                            <div><strong>סוג:</strong> ${analysis.documentType}</div>
                            <div><strong>קטגוריה:</strong> ${analysis.category}</div>
                            <div><strong>דחיפות:</strong> <span class="urgency-${analysis.urgency}">${analysis.urgency}</span></div>
                        </div>
                    </div>

                    <div class="extracted-content">
                        <h4>📝 תוכן שזוהה (OCR)</h4>
                        <div class="extracted-text">
                            ${analysis.extractedText.substring(0, 200)}...
                        </div>
                        <button class="show-full-text" onclick="this.nextElementSibling.style.display='block'; this.style.display='none'">הצג טקסט מלא</button>
                        <div class="full-extracted-text" style="display:none">
                            <pre>${analysis.extractedText}</pre>
                        </div>
                    </div>

                    <div class="ai-suggestions">
                        <h4>🎯 המלצות AI</h4>
                        <ul class="suggestions-list">
                            ${analysis.suggestedActions.map(action => 
                                `<li><span class="suggestion-icon">✓</span> ${action}</li>`
                            ).join('')}
                        </ul>
                    </div>

                    ${analysis.relatedTask.exists ? `
                        <div class="related-task">
                            <h4>🔗 משימה קיימת</h4>
                            <div class="task-update">
                                <p>זוהתה משימה קיימת שדורשת עדכון:</p>
                                <div class="existing-task">
                                    <strong>משימה #${analysis.relatedTask.taskId}</strong>
                                    <ul>
                                        ${analysis.relatedTask.updates.map(update => 
                                            `<li class="update-item">
                                                <input type="checkbox" checked> ${update}
                                            </li>`
                                        ).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ` : `
                        <div class="new-task-suggestion">
                            <h4>➕ משימה חדשה מוצעת</h4>
                            <div class="new-task-details">
                                <input type="text" value="${analysis.relatedTask.suggestedNewTask.title}" id="newTaskTitle">
                                <select id="newTaskCategory">
                                    <option value="academic" ${analysis.category === 'אקדמיה' ? 'selected' : ''}>אקדמיה</option>
                                    <option value="bureaucracy" ${analysis.category === 'ביורוקרטיה' ? 'selected' : ''}>ביורוקרטיה</option>
                                    <option value="debts" ${analysis.category === 'חובות' ? 'selected' : ''}>חובות</option>
                                    <option value="general" ${analysis.category === 'כללי' ? 'selected' : ''}>כללי</option>
                                </select>
                                <select id="newTaskPriority">
                                    <option value="דחוף" ${analysis.urgency === 'דחוף' ? 'selected' : ''}>דחוף</option>
                                    <option value="גבוה" ${analysis.urgency === 'גבוה' ? 'selected' : ''}>גבוה</option>
                                    <option value="בינוני" ${analysis.urgency === 'בינוני' ? 'selected' : ''}>בינוני</option>
                                    <option value="נמוך" ${analysis.urgency === 'נמוך' ? 'selected' : ''}>נמוך</option>
                                </select>
                            </div>
                        </div>
                    `}

                    <div class="confidence-indicator">
                        <h4>📊 רמת ביטחון AI</h4>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: 87%"></div>
                            <span class="confidence-text">87% בטוח</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer approval-footer">
                    <div class="approval-actions">
                        <button class="btn-approve" onclick="documentProcessor.approveAnalysis('${analysis.type}', true)">
                            ✅ אשר ובצע
                        </button>
                        <button class="btn-modify" onclick="documentProcessor.modifyAnalysis('${analysis.type}')">
                            ✏️ ערוך ואשר
                        </button>
                        <button class="btn-reject" onclick="documentProcessor.rejectAnalysis('${analysis.type}')">
                            ❌ דחה
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add event handlers
        modal.querySelector('.modal-close').onclick = () => {
            document.body.removeChild(modal);
            onResolve({ approved: false, action: 'cancelled' });
        };

        // Store resolve function for button handlers
        this.currentResolve = onResolve;
        this.currentModal = modal;
        this.currentAnalysis = analysis;

        return modal;
    }

    approveAnalysis(type, autoExecute = false) {
        showNotification('עיבוד מסמך אושר!', 'success');
        
        if (this.currentAnalysis.relatedTask.exists) {
            this.updateExistingTask();
        } else {
            this.createNewTask();
        }

        if (autoExecute) {
            this.executeAllSuggestions();
        }

        document.body.removeChild(this.currentModal);
        this.currentResolve({ approved: true, action: 'approved', analysis: this.currentAnalysis });
    }

    modifyAnalysis(type) {
        // Allow user to modify the analysis
        showNotification('מעבר למצב עריכה...', 'info');
        
        const modal = this.currentModal;
        const inputs = modal.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.disabled = false;
            input.style.border = '2px solid #3182ce';
        });

        // Change buttons
        const footer = modal.querySelector('.approval-footer');
        footer.innerHTML = `
            <div class="approval-actions">
                <button class="btn-approve" onclick="documentProcessor.saveModifications()">
                    💾 שמור שינויים
                </button>
                <button class="btn-reject" onclick="documentProcessor.cancelModifications()">
                    🚫 בטל
                </button>
            </div>
        `;
    }

    saveModifications() {
        showNotification('שינויים נשמרו בהצלחה!', 'success');
        this.approveAnalysis('modified', true);
    }

    cancelModifications() {
        showNotification('עריכה בוטלה', 'info');
        document.body.removeChild(this.currentModal);
        this.currentResolve({ approved: false, action: 'cancelled' });
    }

    rejectAnalysis(type) {
        showNotification('עיבוד מסמך נדחה', 'warning');
        document.body.removeChild(this.currentModal);
        this.currentResolve({ approved: false, action: 'rejected' });
    }

    updateExistingTask() {
        const analysis = this.currentAnalysis;
        const taskId = analysis.relatedTask.taskId;
        
        // Update existing task with new information
        let targetArray, targetTask;
        
        if (analysis.category === 'חובות') {
            targetArray = appData.debts;
        } else if (analysis.category === 'ביורוקרטיה') {
            targetArray = appData.bureaucracy;
        } else {
            targetArray = appData.tasks;
        }
        
        targetTask = targetArray.find(item => item.id === taskId);
        if (targetTask) {
            targetTask.lastUpdated = new Date().toISOString();
            targetTask.status = 'עודכן ממסמך';
            
            // Add document reference
            if (!targetTask.documents) targetTask.documents = [];
            targetTask.documents.push({
                type: this.getDocumentType(analysis.fileName),
                name: analysis.fileName,
                url: '#',
                addedDate: new Date().toISOString()
            });
        }
        
        updateDisplay();
    }

    createNewTask() {
        const analysis = this.currentAnalysis;
        const modal = this.currentModal;
        
        const title = modal.querySelector('#newTaskTitle')?.value || analysis.relatedTask.suggestedNewTask.title;
        const category = modal.querySelector('#newTaskCategory')?.value || 'general';
        const priority = modal.querySelector('#newTaskPriority')?.value || 'בינוני';
        
        const newTask = {
            id: Date.now(),
            project: title,
            client: 'מסמך מעובד',
            action: analysis.suggestedActions[0] || 'בדוק מסמך',
            status: 'חדש ממסמך',
            priority: priority,
            deadline: this.calculateDeadline(analysis),
            documents: [{
                type: this.getDocumentType(analysis.fileName),
                name: analysis.fileName,
                url: '#',
                addedDate: new Date().toISOString()
            }]
        };

        // Add to appropriate array
        if (category === 'debts' || analysis.category === 'חובות') {
            newTask.creditor = analysis.creditor || 'לא זוהה';
            newTask.company = analysis.company || 'לא זוהה';
            newTask.amount = analysis.amount || 0;
            newTask.currency = analysis.currency || 'EUR';
            appData.debts.push(newTask);
        } else if (category === 'bureaucracy' || analysis.category === 'ביורוקרטיה') {
            newTask.task = title;
            newTask.authority = analysis.authority || 'לא זוהה';
            appData.bureaucracy.push(newTask);
        } else {
            appData.tasks.push(newTask);
        }
        
        updateDisplay();
        showNotification(`נוצרה משימה חדשה: ${title}`, 'success');
    }

    executeAllSuggestions() {
        const suggestions = this.currentAnalysis.suggestedActions;
        showNotification(`מבצע ${suggestions.length} פעולות מוצעות...`, 'info');
        
        suggestions.forEach((action, index) => {
            setTimeout(() => {
                showNotification(`✓ ${action}`, 'success');
            }, (index + 1) * 1000);
        });
    }

    getDocumentType(fileName) {
        const ext = fileName.toLowerCase().split('.').pop();
        if (['pdf'].includes(ext)) return 'pdf';
        if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
        if (['eml', 'msg'].includes(ext)) return 'email';
        return 'doc';
    }

    calculateDeadline(analysis) {
        if (analysis.dueDate) return analysis.dueDate;
        
        const today = new Date();
        if (analysis.urgency === 'דחוף') {
            today.setDate(today.getDate() + 3);
        } else if (analysis.urgency === 'גבוה') {
            today.setDate(today.getDate() + 7);
        } else {
            today.setDate(today.getDate() + 14);
        }
        
        return today.toISOString().split('T')[0];
    }
}

// Global instance
const documentProcessor = new DocumentProcessor();