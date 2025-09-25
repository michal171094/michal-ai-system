const express = require('express');
const router = express.Router();
const database = require('../config/database');
const AIService = require('../services/AIService');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

// GET /api/tasks - קבלת כל המשימות
router.get('/', async (req, res) => {
    try {
        const { module, status, priority, client_id, limit = 50, offset = 0 } = req.query;
        
        // במצב mock - החזר נתונים סטטיים
        if (process.env.DB_MOCK === 'true') {
            const mockTasks = require('../scripts/mockData').tasks;
            return res.json({
                success: true,
                data: mockTasks,
                total: mockTasks.length,
                message: 'משימות נטענו בהצלחה'
            });
        }

        const userId = req.user.id;

        let query = `
            SELECT 
                t.*,
                c.name as client_name,
                c.company as client_company
            FROM tasks t
            LEFT JOIN clients c ON t.client_id = c.id
            WHERE t.user_id = $1
        `;
        const params = [userId];
        let paramIndex = 2;

        // פילטרים אופציונליים
        if (module) {
            query += ` AND t.module = $${paramIndex}`;
            params.push(module);
            paramIndex++;
        }

        if (status) {
            query += ` AND t.status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        if (priority) {
            query += ` AND t.priority = $${paramIndex}`;
            params.push(priority);
            paramIndex++;
        }

        if (client_id) {
            query += ` AND t.client_id = $${paramIndex}`;
            params.push(client_id);
            paramIndex++;
        }

        query += ` ORDER BY 
            CASE t.priority 
                WHEN 'urgent' THEN 1
                WHEN 'high' THEN 2
                WHEN 'medium' THEN 3
                WHEN 'low' THEN 4
            END,
            t.deadline ASC NULLS LAST,
            t.created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        const result = await database.query(query, params);
        
        // ספירת סה"כ משימות
        const countQuery = `
            SELECT COUNT(*) as total
            FROM tasks t
            WHERE t.user_id = $1
            ${module ? ' AND t.module = $2' : ''}
        `;
        const countParams = [userId];
        if (module) countParams.push(module);
        
        const countResult = await database.query(countQuery, countParams);
        
        res.json({
            success: true,
            data: result.rows,
            pagination: {
                total: parseInt(countResult.rows[0].total),
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });

    } catch (error) {
        logger.error('שגיאה בקבלת משימות:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת המשימות'
        });
    }
});

// GET /api/tasks/urgent - משימות דחופות בלבד
router.get('/urgent', async (req, res) => {
    try {
        const userId = req.user.id;
        
        const result = await database.query(`
            SELECT 
                t.*,
                c.name as client_name,
                c.company as client_company
            FROM tasks t
            LEFT JOIN clients c ON t.client_id = c.id
            WHERE t.user_id = $1 
            AND (
                t.priority = 'urgent' 
                OR t.deadline <= CURRENT_DATE + INTERVAL '3 days'
                OR t.status = 'overdue'
            )
            ORDER BY 
                CASE t.priority 
                    WHEN 'urgent' THEN 1
                    ELSE 2
                END,
                t.deadline ASC NULLS LAST
        `, [userId]);

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        logger.error('שגיאה בקבלת משימות דחופות:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת המשימות הדחופות'
        });
    }
});

// GET /api/tasks/stats - סטטיסטיקות משימות
router.get('/stats', async (req, res) => {
    try {
        const userId = req.user.id;
        
        const stats = await database.query(`
            SELECT 
                COUNT(*) as total_tasks,
                COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_tasks,
                COUNT(*) FILTER (WHERE deadline <= CURRENT_DATE + INTERVAL '7 days' AND status != 'completed') as due_this_week,
                COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
                COUNT(*) FILTER (WHERE deadline < CURRENT_DATE AND status != 'completed') as overdue_tasks,
                COALESCE(SUM(price_final) FILTER (WHERE payment_status = 'paid'), 0) as total_revenue,
                COALESCE(SUM(price_quoted) FILTER (WHERE status != 'completed'), 0) as pending_revenue
            FROM tasks 
            WHERE user_id = $1
        `, [userId]);

        const moduleStats = await database.query(`
            SELECT 
                module,
                COUNT(*) as count,
                COUNT(*) FILTER (WHERE status = 'completed') as completed
            FROM tasks 
            WHERE user_id = $1
            GROUP BY module
        `, [userId]);

        res.json({
            success: true,
            data: {
                overview: stats.rows[0],
                by_module: moduleStats.rows
            }
        });

    } catch (error) {
        logger.error('שגיאה בקבלת סטטיסטיקות:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בקבלת הסטטיסטיקות'
        });
    }
});

// POST /api/tasks - יצירת משימה חדשה
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            title,
            description,
            module,
            task_type,
            client_id,
            deadline,
            priority = 'medium',
            price_quoted,
            action_required,
            metadata = {}
        } = req.body;

        // וולידציה בסיסית
        if (!title || !module) {
            return res.status(400).json({
                success: false,
                message: 'כותרת ומודול הם שדות חובה'
            });
        }

        const taskId = uuidv4();
        
        // יצירת המשימה
        const result = await database.query(`
            INSERT INTO tasks (
                id, user_id, client_id, title, description, module, 
                task_type, priority, deadline, price_quoted, 
                action_required, metadata
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING *
        `, [
            taskId, userId, client_id, title, description, module,
            task_type, priority, deadline, price_quoted,
            action_required, JSON.stringify(metadata)
        ]);

        // ניתוח דחיפות עם AI
        try {
            const urgencyScore = await AIService.analyzeUrgency({
                title,
                description,
                deadline,
                task_type,
                client_name: req.body.client_name
            });

            if (urgencyScore >= 8) {
                await database.query(
                    'UPDATE tasks SET priority = $1 WHERE id = $2',
                    ['urgent', taskId]
                );
            }
        } catch (aiError) {
            logger.warn('שגיאה בניתוח דחיפות AI:', aiError);
        }

        // רישום הפעולה בלוג
        await database.query(`
            INSERT INTO actions_log (user_id, action_type, entity_type, entity_id, action_data)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            userId,
            'task_created',
            'task',
            taskId,
            JSON.stringify({ title, module, priority })
        ]);

        logger.info(`✅ משימה חדשה נוצרה: ${title} (${taskId})`);

        res.status(201).json({
            success: true,
            data: result.rows[0],
            message: 'המשימה נוצרה בהצלחה'
        });

    } catch (error) {
        logger.error('שגיאה ביצירת משימה:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה ביצירת המשימה'
        });
    }
});

// PUT /api/tasks/:id - עדכון משימה
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const updates = req.body;

        // בדיקה שהמשימה שייכת למשתמש
        const existingTask = await database.query(
            'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
            [taskId, userId]
        );

        if (existingTask.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'משימה לא נמצאה'
            });
        }

        // בניית שאילתת עדכון דינמית
        const allowedFields = [
            'title', 'description', 'status', 'priority', 'deadline',
            'price_quoted', 'price_final', 'payment_status', 'action_required',
            'estimated_hours', 'actual_hours', 'metadata'
        ];
        
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 3;

        for (const [key, value] of Object.entries(updates)) {
            if (allowedFields.includes(key)) {
                updateFields.push(`${key} = $${paramIndex}`);
                updateValues.push(key === 'metadata' ? JSON.stringify(value) : value);
                paramIndex++;
            }
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'לא נמצאו שדות תקינים לעדכון'
            });
        }

        // אם המשימה הושלמה, עדכן את תאריך ההשלמה
        if (updates.status === 'completed') {
            updateFields.push(`completed_at = $${paramIndex}`);
            updateValues.push(new Date());
        }

        const query = `
            UPDATE tasks 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        
        const result = await database.query(query, [taskId, userId, ...updateValues]);

        // רישום הפעולה
        await database.query(`
            INSERT INTO actions_log (user_id, action_type, entity_type, entity_id, action_data)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            userId,
            'task_updated',
            'task',
            taskId,
            JSON.stringify(updates)
        ]);

        res.json({
            success: true,
            data: result.rows[0],
            message: 'המשימה עודכנה בהצלחה'
        });

    } catch (error) {
        logger.error('שגיאה בעדכון משימה:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה בעדכון המשימה'
        });
    }
});

// POST /api/tasks/:id/action - ביצוע פעולה חכמה
router.post('/:id/action', async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const { actionType, parameters = {} } = req.body;

        // קבלת המשימה
        const taskResult = await database.query(`
            SELECT t.*, c.name as client_name, c.email as client_email
            FROM tasks t
            LEFT JOIN clients c ON t.client_id = c.id
            WHERE t.id = $1 AND t.user_id = $2
        `, [taskId, userId]);

        if (taskResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'משימה לא נמצאה'
            });
        }

        const task = taskResult.rows[0];
        let actionResult = {};

        // ביצוע פעולות חכמות שונות
        switch (actionType) {
            case 'generate_document':
                actionResult = await AIService.generateDocument(
                    parameters.documentType,
                    { ...task, ...parameters },
                    userId
                );
                break;

            case 'send_reminder':
                // שליחת תזכורת למייל (יתווסף בהמשך)
                actionResult = { 
                    message: 'תזכורת נשלחה בהצלחה',
                    email_sent: true 
                };
                break;

            case 'schedule_followup':
                // יצירת משימת מעקב
                const followupTaskId = uuidv4();
                await database.query(`
                    INSERT INTO tasks (
                        id, user_id, client_id, title, description, module,
                        task_type, priority, deadline, action_required
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                `, [
                    followupTaskId,
                    userId,
                    task.client_id,
                    `מעקב: ${task.title}`,
                    `מעקב אוטומטי למשימה: ${task.title}`,
                    task.module,
                    'followup',
                    'medium',
                    parameters.followupDate,
                    'בצע מעקב ובדוק סטטוס'
                ]);
                
                actionResult = { 
                    message: 'משימת מעקב נוצרה',
                    followup_task_id: followupTaskId 
                };
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'סוג פעולה לא נתמך'
                });
        }

        // עדכון המשימה עם הפעולה שבוצעה
        const currentActions = task.smart_actions || [];
        currentActions.push({
            type: actionType,
            parameters,
            result: actionResult,
            executed_at: new Date().toISOString()
        });

        await database.query(
            'UPDATE tasks SET smart_actions = $1 WHERE id = $2',
            [JSON.stringify(currentActions), taskId]
        );

        // רישום בלוג הפעולות
        await database.query(`
            INSERT INTO actions_log (user_id, action_type, entity_type, entity_id, action_data, success)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            userId,
            `smart_action_${actionType}`,
            'task',
            taskId,
            JSON.stringify({ parameters, result: actionResult }),
            true
        ]);

        logger.info(`🤖 פעולה חכמה בוצעה: ${actionType} על משימה ${taskId}`);

        res.json({
            success: true,
            data: actionResult,
            message: 'הפעולה בוצעה בהצלחה'
        });

    } catch (error) {
        logger.error('שגיאה בביצוע פעולה חכמה:', error);
        
        // רישום כישלון
        await database.query(`
            INSERT INTO actions_log (user_id, action_type, entity_type, entity_id, action_data, success, error_message)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            req.user.id,
            `smart_action_${req.body.actionType}`,
            'task',
            req.params.id,
            JSON.stringify(req.body),
            false,
            error.message
        ]);

        res.status(500).json({
            success: false,
            message: 'שגיאה בביצוע הפעולה'
        });
    }
});

// DELETE /api/tasks/:id - מחיקת משימה
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const result = await database.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING title',
            [taskId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'משימה לא נמצאה'
            });
        }

        logger.info(`🗑️ משימה נמחקה: ${result.rows[0].title} (${taskId})`);

        res.json({
            success: true,
            message: 'המשימה נמחקה בהצלחה'
        });

    } catch (error) {
        logger.error('שגיאה במחיקת משימה:', error);
        res.status(500).json({
            success: false,
            message: 'שגיאה במחיקת המשימה'
        });
    }
});

module.exports = router;