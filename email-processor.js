// Advanced Email Analysis and Processing
class EmailProcessor {
    constructor() {
        this.emailPatterns = {
            debt: ['pair', 'creditreform', 'eos', 'inkasso', 'mahnung', 'zahlungsaufforderung', 'debt', 'collection'],
            bureaucracy: ['standesamt', 'arbeitsagentur', 'aok', 'finanzamt', 'ausländerbehörde', 'visa', 'permit'],
            academic: ['university', 'professor', 'seminar', 'thesis', 'assignment', 'grade'],
            urgent: ['urgent', 'dringend', 'letzte mahnung', 'final notice', 'deadline', 'frist']
        };
    }

    async processGmailSync() {
        showNotification('מתחבר ל-Gmail ומנתח הודעות...', 'info');
        
        try {
            const emails = await this.fetchEmails();

            if (!emails || emails.length === 0) {
                showNotification('לא נמצאו מיילים חדשים ב-Gmail', 'info');
                return { approved: false, action: 'no_emails', analyses: [] };
            }

            const analyses = await this.analyzeEmails(emails);
            return this.showBatchApprovalPopup(analyses);
            
        } catch (error) {
            if (error && error.message === 'AUTH_REQUIRED') {
                showNotification('נדרש אישור גישה ל-Gmail. אנא אשרי בחלון שנפתח.', 'warning');
                return { approved: false, action: 'auth_required' };
            }

            console.error('Email processing error:', error);
            showNotification('שגיאה בניתוח מיילים', 'error');
            throw error;
        }
    }

    async fetchEmails() {
        const response = await fetch('/api/gmail/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
            const data = await response.json();
            if (data.auth_required && data.auth_url) {
                window.open(data.auth_url, '_blank');
                throw new Error('AUTH_REQUIRED');
            }
        }

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.error || 'Gmail sync failed');
        }

        const data = await response.json();
        return data.emails || [];
    }

    async analyzeEmails(emails) {
        const analyses = [];
        
        for (const email of emails) {
            showNotification(`מנתח: ${email.subject}...`, 'info');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const analysis = this.analyzeIndividualEmail(email);
            analyses.push(analysis);
        }
        
        return analyses;
    }

    analyzeIndividualEmail(email) {
        const originalSubject = email.subject || '(ללא נושא)';
        const originalBody = (email.body || email.snippet || '').replace(/\r/g, '');
        const originalSender = email.from || '';

        const subject = originalSubject.toLowerCase();
        const body = originalBody.toLowerCase();
        const sender = originalSender.toLowerCase();
        const attachments = (email.attachments || []).map(att => {
            if (typeof att === 'string') return att;
            if (!att) return 'קובץ מצורף';
            return att.filename || att.name || `קובץ (${att.mimeType || 'לא זוהה'})`;
        });
        
        let category = 'כללי';
        let urgency = 'בינוני';
        let type = 'general';
        let suggestedActions = [];
        let relatedTask = { exists: false };
        let extractedData = {};

        // Debt detection
        if (this.containsPatterns(subject + ' ' + body + ' ' + sender, this.emailPatterns.debt)) {
            category = 'חובות';
            type = 'debt_notice';
            urgency = 'דחוף';
            
            // Extract amount
            const amountMatch = originalBody.match(/(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})\s*(?:EUR|€)/i);
            if (amountMatch) {
                extractedData.amount = amountMatch[1].replace(',', '.') + ' EUR';
            }
            
            // Extract creditor
            if (sender.includes('pair')) {
                extractedData.creditor = 'PAIR Finance';
                extractedData.company = 'Amazon';
                relatedTask = { exists: true, taskId: 1, type: 'debt' };
            }
            
            suggestedActions = [
                'התקשר לחברת הגבייה',
                'בדוק את תקיפות החוב', 
                'בקש הסדר תשלומים',
                'שלח מכתב התנגדות אם נדרש'
            ];
        }
        
        // Bureaucracy detection
        else if (this.containsPatterns(subject + ' ' + body + ' ' + sender, this.emailPatterns.bureaucracy)) {
            category = 'ביורוקרטיה';
            type = 'bureaucracy_notice';
            urgency = 'גבוה';
            
            if (sender.includes('standesamt')) {
                extractedData.authority = 'Standesamt Berlin';
                extractedData.documentType = 'רישום נישואין';
                relatedTask = { exists: true, taskId: 1, type: 'bureaucracy' };
                suggestedActions = [
                    'הזמן תעודת לידה עם אפוסטיל',
                    'הכן אישור רווקות', 
                    'תרגם מסמכים לגרמנית',
                    'קבע מועד במשרד'
                ];
            } else if (sender.includes('aok')) {
                extractedData.authority = 'AOK';
                extractedData.documentType = 'ביטוח בריאות';
                relatedTask = { exists: true, taskId: 2, type: 'bureaucracy' };
                suggestedActions = [
                    'שמור מספר ביטוח חדש',
                    'עדכן פרטים אישיים',
                    'בקש כרטיס ביטוח',
                    'מצא רופא משפחה'
                ];
            }
        }
        
        // Academic detection
        else if (this.containsPatterns(subject + ' ' + body + ' ' + sender, this.emailPatterns.academic)) {
            category = 'אקדמיה';
            type = 'academic_notice';
            urgency = 'דחוף';
            
            if (body.includes('עבודת סמינר') || body.includes('הגשה')) {
                extractedData.project = 'עבודת סמינר פסיכולוגיה';
                relatedTask = { exists: true, taskId: 1, type: 'academic' };
                suggestedActions = [
                    'סיים עבודת סמינר דחוף',
                    'התקשר למזכירות',
                    'בקש הארכה אם נדרש',
                    'הכן מצגת'
                ];
            }
        }
        
        // Check urgency indicators
        if (this.containsPatterns(subject + ' ' + body, this.emailPatterns.urgent)) {
            urgency = 'קריטי';
        }

        // Extract dates
        const dateMatches = originalBody.match(/(\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{4})/g);
        if (dateMatches) {
            extractedData.dates = dateMatches;
            extractedData.deadline = this.parseGermanDate(dateMatches[0]);
        }

        return {
            emailId: email.id,
            from: originalSender,
            subject: originalSubject,
            date: email.date,
            category,
            type,
            urgency,
            extractedData,
            suggestedActions,
            relatedTask,
            attachments,
            bodyPreview: originalBody ? originalBody.substring(0, 200) + (originalBody.length > 200 ? '...' : '') : (email.snippet || ''),
            fullBody: originalBody || email.snippet || '',
            confidence: this.calculateConfidence(category, extractedData, suggestedActions)
        };
    }

    containsPatterns(text, patterns) {
        return patterns.some(pattern => text.includes(pattern));
    }

    parseGermanDate(dateStr) {
        // Parse German date format (DD.MM.YYYY)
        const parts = dateStr.split(/[.\-\/]/);
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
        return null;
    }

    calculateConfidence(category, extractedData, actions) {
        let confidence = 60; // Base confidence
        
        if (Object.keys(extractedData).length > 2) confidence += 20;
        if (actions.length > 3) confidence += 15;
        if (category !== 'כללי') confidence += 15;
        
        return Math.min(confidence, 95);
    }

    showBatchApprovalPopup(analyses) {
        return new Promise((resolve) => {
            const modal = this.createBatchApprovalModal(analyses, resolve);
            document.body.appendChild(modal);
        });
    }

    createBatchApprovalModal(analyses, onResolve) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay batch-approval-modal';
        
        modal.innerHTML = `
            <div class="modal-content batch-approval-content">
                <div class="modal-header batch-approval-header">
                    <div class="approval-title">
                        <span class="approval-icon">📧</span>
                        <h3>אישור ניתוח מיילים חכם</h3>
                        <span class="email-count">${analyses.length} הודעות נמצאו</span>
                    </div>
                    <button class="modal-close">&times;</button>
                </div>
                
                <div class="modal-body batch-approval-body">
                    <div class="batch-summary">
                        <div class="summary-stats">
                            <div class="stat critical">
                                <span class="stat-number">${analyses.filter(a => a.urgency === 'קריטי').length}</span>
                                <span class="stat-label">קריטי</span>
                            </div>
                            <div class="stat urgent">
                                <span class="stat-number">${analyses.filter(a => a.urgency === 'דחוף').length}</span>
                                <span class="stat-label">דחוף</span>
                            </div>
                            <div class="stat tasks">
                                <span class="stat-number">${analyses.filter(a => a.relatedTask.exists).length}</span>
                                <span class="stat-label">קשור למשימות</span>
                            </div>
                        </div>
                    </div>

                    <div class="emails-list">
                        ${analyses.map((analysis, index) => `
                            <div class="email-analysis-item ${analysis.urgency}" data-index="${index}">
                                <div class="email-header">
                                    <div class="email-info">
                                        <div class="email-subject">${analysis.subject}</div>
                                        <div class="email-from">מ: ${analysis.from}</div>
                                    </div>
                                    <div class="email-meta">
                                        <span class="urgency-badge ${analysis.urgency}">${analysis.urgency}</span>
                                        <span class="category-badge">${analysis.category}</span>
                                        <span class="confidence">${analysis.confidence}%</span>
                                    </div>
                                </div>
                                
                                <div class="email-analysis">
                                    <div class="extracted-data">
                                        ${Object.keys(analysis.extractedData).length > 0 ? `
                                            <strong>נתונים שזוהו:</strong>
                                            <ul>
                                                ${Object.entries(analysis.extractedData).map(([key, value]) => 
                                                    `<li><strong>${this.translateKey(key)}:</strong> ${value}</li>`
                                                ).join('')}
                                            </ul>
                                        ` : '<em>לא זוהו נתונים מיוחדים</em>'}
                                    </div>
                                    
                                    <div class="suggested-actions">
                                        <strong>פעולות מוצעות:</strong>
                                        <ul>
                                            ${analysis.suggestedActions.map(action => 
                                                `<li><input type="checkbox" checked> ${action}</li>`
                                            ).join('')}
                                        </ul>
                                    </div>
                                    
                                    ${analysis.relatedTask.exists ? `
                                        <div class="related-task">
                                            <strong>🔗 קשור למשימה קיימת</strong> #${analysis.relatedTask.taskId}
                                            <button class="view-task" onclick="emailProcessor.showRelatedTask(${analysis.relatedTask.taskId})">הצג משימה</button>
                                        </div>
                                    ` : `
                                        <div class="new-task">
                                            <strong>➕ ייצור משימה חדשה</strong>
                                            <input type="text" placeholder="כותרת המשימה" value="טיפול ב${analysis.subject}">
                                        </div>
                                    `}
                                    
                                    ${analysis.attachments.length > 0 ? `
                                        <div class="attachments">
                                            <strong>📎 קבצים מצורפים:</strong>
                                            ${analysis.attachments.map(att => `<span class="attachment">${att}</span>`).join(', ')}
                                        </div>
                                    ` : ''}
                                </div>

                                <div class="email-preview">
                                    <button class="toggle-preview" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                                        ${analysis.urgency === 'קריטי' ? '⚠️' : analysis.urgency === 'דחוף' ? '🔥' : '📄'} הצג תוכן מייל
                                    </button>
                                    <div class="email-body-preview" style="display: none;">
                                        <pre>${analysis.fullBody}</pre>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="modal-footer batch-approval-footer">
                    <div class="batch-actions">
                        <button class="btn-approve-all" onclick="emailProcessor.approveAllEmails()">
                            ✅ אשר הכל ובצע
                        </button>
                        <button class="btn-approve-urgent" onclick="emailProcessor.approveUrgentOnly()">
                            🔥 אשר רק דחופים
                        </button>
                        <button class="btn-review" onclick="emailProcessor.reviewIndividually()">
                            🔍 בדוק אחד אחד
                        </button>
                        <button class="btn-reject-all" onclick="emailProcessor.rejectAllEmails()">
                            ❌ דחה הכל
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

        // Store for later use
        this.currentBatchResolve = onResolve;
        this.currentBatchModal = modal;
        this.currentAnalyses = analyses;

        return modal;
    }

    translateKey(key) {
        const translations = {
            amount: 'סכום',
            creditor: 'נושה',
            company: 'חברה',
            authority: 'רשות',
            documentType: 'סוג מסמך',
            project: 'פרויקט',
            deadline: 'מועד אחרון',
            dates: 'תאריכים'
        };
        return translations[key] || key;
    }

    approveAllEmails() {
        showNotification(`מעבד ${this.currentAnalyses.length} מיילים...`, 'info');
        
        this.currentAnalyses.forEach((analysis, index) => {
            setTimeout(() => {
                this.processEmailAnalysis(analysis);
                showNotification(`✓ עובד מייל: ${analysis.subject}`, 'success');
            }, index * 500);
        });
        
        setTimeout(() => {
            updateDisplay();
            showNotification('כל המיילים עובדו בהצלחה!', 'success');
        }, this.currentAnalyses.length * 500);
        
        document.body.removeChild(this.currentBatchModal);
        this.currentBatchResolve({ approved: true, action: 'approved_all', analyses: this.currentAnalyses });
    }

    approveUrgentOnly() {
        const urgentEmails = this.currentAnalyses.filter(a => a.urgency === 'קריטי' || a.urgency === 'דחוף');
        showNotification(`מעבד ${urgentEmails.length} מיילים דחופים...`, 'info');
        
        urgentEmails.forEach((analysis, index) => {
            setTimeout(() => {
                this.processEmailAnalysis(analysis);
                showNotification(`🔥 עובד מייל דחוף: ${analysis.subject}`, 'success');
            }, index * 500);
        });
        
        document.body.removeChild(this.currentBatchModal);
        this.currentBatchResolve({ approved: true, action: 'approved_urgent', analyses: urgentEmails });
    }

    reviewIndividually() {
        showNotification('מעבר לבדיקה אישית...', 'info');
        // This would open individual approval modals
        document.body.removeChild(this.currentBatchModal);
        this.currentBatchResolve({ approved: false, action: 'review_individual' });
    }

    rejectAllEmails() {
        showNotification('כל המיילים נדחו', 'warning');
        document.body.removeChild(this.currentBatchModal);
        this.currentBatchResolve({ approved: false, action: 'rejected_all' });
    }

    processEmailAnalysis(analysis) {
        if (analysis.relatedTask.exists) {
            this.updateExistingTaskFromEmail(analysis);
        } else {
            this.createNewTaskFromEmail(analysis);
        }
    }

    updateExistingTaskFromEmail(analysis) {
        const taskId = analysis.relatedTask.taskId;
        const taskType = analysis.relatedTask.type;
        
        let targetArray;
        if (taskType === 'debt') targetArray = appData.debts;
        else if (taskType === 'bureaucracy') targetArray = appData.bureaucracy;
        else targetArray = appData.tasks;
        
        const task = targetArray.find(item => item.id === taskId);
        if (task) {
            task.lastUpdated = new Date().toISOString();
            task.status = 'עודכן ממייל';
            task.emailUpdate = {
                from: analysis.from,
                subject: analysis.subject,
                date: analysis.date
            };
        }
    }

    createNewTaskFromEmail(analysis) {
        const newTask = {
            id: Date.now() + Math.random(),
            project: analysis.subject,
            client: analysis.from,
            action: analysis.suggestedActions[0] || 'טפל במייל',
            status: 'חדש ממייל',
            priority: analysis.urgency,
            deadline: analysis.extractedData.deadline || this.calculateEmailDeadline(analysis.urgency),
            emailSource: {
                from: analysis.from,
                subject: analysis.subject,
                date: analysis.date
            }
        };

        if (analysis.category === 'חובות') {
            Object.assign(newTask, {
                creditor: analysis.extractedData.creditor || 'לא זוהה',
                company: analysis.extractedData.company || 'לא זוהה', 
                amount: analysis.extractedData.amount || '0',
                currency: 'EUR'
            });
            appData.debts.push(newTask);
        } else if (analysis.category === 'ביורוקרטיה') {
            Object.assign(newTask, {
                task: analysis.subject,
                authority: analysis.extractedData.authority || 'לא זוהה'
            });
            appData.bureaucracy.push(newTask);
        } else {
            appData.tasks.push(newTask);
        }
    }

    calculateEmailDeadline(urgency) {
        const today = new Date();
        if (urgency === 'קריטי') today.setDate(today.getDate() + 1);
        else if (urgency === 'דחוף') today.setDate(today.getDate() + 3);
        else today.setDate(today.getDate() + 7);
        return today.toISOString().split('T')[0];
    }

    showRelatedTask(taskId) {
        // This would show the related task details
        showNotification(`מציג משימה קשורה #${taskId}`, 'info');
    }
}

// Global instance
const emailProcessor = new EmailProcessor();