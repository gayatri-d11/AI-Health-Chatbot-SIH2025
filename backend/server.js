const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./models/mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect Database
connectDB();

// Create uploads directory for audio files
const fs = require('fs');
const uploadsDir = './uploads/audio';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}



















// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For Twilio form data

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin-setup', require('./routes/admin-setup'));
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/whatsapp', require('./routes/whatsapp'));
app.use('/api/sms', require('./routes/sms'));
app.use('/api/voice', require('./routes/voice'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'HealthBot API is running!',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      chat: '/api/chat',
      alerts: '/api/alerts',
      users: '/api/users'
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ HealthBot API running on http://localhost:${PORT}`);
  console.log(`🏥 AI-Powered Health Assistant for Rural India`);
  console.log(`📱 Multi-channel: Web, WhatsApp, SMS, Voice`);
  console.log(`🌐 Multilingual: 10+ Indian Languages`);
  console.log(`🔐 Secure & Private Health Data`);
  console.log(`\n📋 To create admin user: POST /api/admin-setup/create-admin`);
  console.log(`🔑 Admin setup key: SIH2024_ADMIN_SETUP`);
});