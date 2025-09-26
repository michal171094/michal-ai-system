// Simple fallback server for deployment recovery
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Simple data storage
let appData = { tasks: [], debts: [], bureaucracy: [], emails: [] };
const DATA_FILE = path.join(__dirname, 'data', 'appData.json');

function loadAppData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      appData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.warn('Data load failed, using empty data');
  }
}

function saveAppData() {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(appData, null, 2));
  } catch (e) {
    console.warn('Data save failed');
  }
}

// Load initial data
loadAppData();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', ts: new Date().toISOString() });
});

// Smart overview
app.get('/api/smart-overview', (req, res) => {
  res.json({
    success: true,
    data: {
      priorities: [],
      stats: {
        total: appData.tasks.length + appData.debts.length + appData.bureaucracy.length,
        critical: 0,
        urgent: 0,
        pending: appData.tasks.length + appData.debts.length + appData.bureaucracy.length
      },
      domains: {
        tasks: appData.tasks,
        debts: appData.debts,
        bureaucracy: appData.bureaucracy,
        emails: []
      },
      lastUpdated: new Date().toISOString()
    }
  });
});

// Tasks CRUD
app.get('/api/tasks', (req, res) => res.json({ success: true, data: appData.tasks }));
app.post('/api/tasks', (req, res) => {
  const t = req.body;
  t.id = Date.now() + Math.random();
  appData.tasks.push(t);
  saveAppData();
  res.json({ success: true, data: t });
});

// Bulk tasks
app.post('/api/tasks/bulk', (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) {
      return res.status(400).json({ success: false, error: 'tasks must be an array' });
    }
    
    const createdTasks = [];
    tasks.forEach(taskData => {
      const t = { ...taskData, id: Date.now() + Math.random() };
      appData.tasks.push(t);
      createdTasks.push(t);
    });
    
    saveAppData();
    res.json({ success: true, created: createdTasks.length, data: createdTasks });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  const id = req.params.id;
  const idx = appData.tasks.findIndex(t => t.id == id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'task not found' });
  appData.tasks[idx] = { ...appData.tasks[idx], ...req.body, id };
  saveAppData();
  res.json({ success: true, data: appData.tasks[idx] });
});

app.delete('/api/tasks', (req, res) => {
  const deletedCount = appData.tasks.length;
  appData.tasks = [];
  saveAppData();
  res.json({ success: true, deleted: deletedCount });
});

// Debts CRUD
app.get('/api/debts', (req, res) => res.json({ success: true, data: appData.debts }));
app.post('/api/debts', (req, res) => {
  const d = req.body;
  d.id = Date.now() + Math.random();
  appData.debts.push(d);
  saveAppData();
  res.json({ success: true, data: d });
});

app.delete('/api/debts', (req, res) => {
  const deletedCount = appData.debts.length;
  appData.debts = [];
  saveAppData();
  res.json({ success: true, deleted: deletedCount });
});

// Bureaucracy CRUD
app.get('/api/bureaucracy', (req, res) => res.json({ success: true, data: appData.bureaucracy }));
app.post('/api/bureaucracy', (req, res) => {
  const b = req.body;
  b.id = Date.now() + Math.random();
  appData.bureaucracy.push(b);
  saveAppData();
  res.json({ success: true, data: b });
});

app.delete('/api/bureaucracy', (req, res) => {
  const deletedCount = appData.bureaucracy.length;
  appData.bureaucracy = [];
  saveAppData();
  res.json({ success: true, deleted: deletedCount });
});

// Gmail endpoints (basic stubs)
app.get('/api/gmail/status', (req, res) => {
  res.json({
    configured: true,
    authenticated: false,
    accounts: [],
    activeEmail: null
  });
});

app.post('/api/gmail/sync', (req, res) => {
  res.json({
    success: false,
    auth_required: true,
    message: 'Gmail OAuth needs configuration'
  });
});

// Connectors status
app.get('/api/connectors/status', (req, res) => {
  res.json({
    success: true,
    data: {
      gmail: {
        configured: true,
        accounts: [],
        activeEmail: null,
        authenticated: false
      }
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Fallback server running on port ${PORT}`);
});