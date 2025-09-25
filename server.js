const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const tasksRoutes = require('./routes/tasks');
const clientsRoutes = require('./routes/clients');
const debtsRoutes = require('./routes/debts');
const bureaucracyRoutes = require('./routes/bureaucracy');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');

// Import middleware
const { authenticateToken } = require('./middleware/auth');
const { errorHandler, notFoundHandler, validateJSON } = require('./middleware/errorHandler');
const { logger, logRequest } = require('./utils/logger');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? false : "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'יותר מדי בקשות מהכתובת הזו, נסה שוב מאוחר יותר.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Request logging
app.use(logRequest);

// JSON validation
app.use(validateJSON);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authenticateToken, tasksRoutes);
app.use('/api/clients', authenticateToken, clientsRoutes);
app.use('/api/debts', authenticateToken, debtsRoutes);
app.use('/api/bureaucracy', authenticateToken, bureaucracyRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV 
    });
});

// Serve the main HTML file for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler for API routes that weren't found
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.id}`);
    
    // Join user to their personal room
    socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        logger.info(`User ${userId} joined room user-${userId}`);
    });
    
    // Handle chat messages
    socket.on('chat-message', async (data) => {
        try {
            const { message, userId } = data;
            
            // Process message with AI service
            const aiResponse = await require('./services/AIService').generateResponse(message, userId);
            
            // Emit response back to user
            io.to(`user-${userId}`).emit('chat-response', {
                message: aiResponse,
                timestamp: new Date().toISOString(),
                type: 'ai'
            });
            
            // Save to chat history
            await require('./models/Chat').saveMessage(userId, message, aiResponse);
            
        } catch (error) {
            logger.error('Error processing chat message:', error);
            socket.emit('chat-error', { message: 'שגיאה בעיבוד ההודעה' });
        }
    });
    
    // Handle real-time task updates
    socket.on('task-update', (data) => {
        socket.broadcast.emit('task-updated', data);
    });
    
    socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

// Start server
server.listen(PORT, () => {
    logger.info(`🚀 מערכת עוזר AI אישית רצה על פורט ${PORT}`);
    logger.info(`🌐 סביבה: ${process.env.NODE_ENV}`);
    logger.info(`📊 Dashboard זמין בכתובת: http://localhost:${PORT}`);
});

module.exports = { app, server, io };