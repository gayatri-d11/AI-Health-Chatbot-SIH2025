const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Test routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'HealthBot API is running!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'user@demo.com' && password === 'demo123') {
    res.json({
      success: true,
      user: { _id: '1', name: 'Demo User', email, role: 'user' },
      token: 'demo-token-1'
    });
  } else if (email === 'admin@demo.com' && password === 'admin123') {
    res.json({
      success: true,
      user: { _id: '2', name: 'Admin User', email, role: 'admin' },
      token: 'demo-token-2'
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  res.json({
    success: true,
    user: { _id: Date.now().toString(), name, email, role: 'user' },
    token: 'demo-token-' + Date.now()
  });
});

// Chat route
app.post('/api/chat', (req, res) => {
  const { message, userId, language } = req.body;
  
  let response = '';
  if (language === 'hi') {
    response = `🩺 **Dr. AI**: आपका संदेश "${message}" प्राप्त हुआ। मैं आपकी स्वास्थ्य संबंधी मदद के लिए यहाँ हूँ।\n\n**आपातकाल:** 108 | **स्वास्थ्य हेल्पलाइन:** 104`;
  } else {
    response = `🩺 **Dr. AI**: I received your message "${message}". I'm here to help with your health concerns.\n\n**Emergency:** 108 | **Health Helpline:** 104`;
  }
  
  res.json({
    response: response,
    confidence: 0.95,
    detectedLanguage: language || 'en',
    responseLanguage: language || 'en',
    source: 'Dr. AI Test Mode'
  });
});

// Quiz routes
app.post('/api/quiz/question', (req, res) => {
  const { language = 'en', questionIndex = 0 } = req.body;
  
  const questions = {
    en: [
      {
        question: "How would you rate your overall health?",
        options: ["Excellent", "Good", "Fair", "Poor"],
        category: "general_health"
      }
    ],
    hi: [
      {
        question: "आप अपने समग्र स्वास्थ्य को कैसे रेट करेंगे?",
        options: ["उत्कृष्ट", "अच्छा", "ठीक-ठाक", "खराब"],
        category: "general_health"
      }
    ]
  };
  
  const questionSet = questions[language] || questions.en;
  const currentQuestion = questionSet[questionIndex];
  
  if (!currentQuestion) {
    return res.json({
      success: true,
      completed: true,
      message: language === 'hi' ? '🎉 सर्वे पूरा हुआ!' : '🎉 Survey completed!',
      totalQuestions: questionSet.length
    });
  }
  
  res.json({
    success: true,
    question: currentQuestion,
    questionNumber: questionIndex + 1,
    totalQuestions: questionSet.length
  });
});

app.post('/api/quiz/submit', (req, res) => {
  res.json({
    success: true,
    message: 'Response saved',
    nextQuestion: req.body.questionIndex + 1
  });
});

// Alerts route
app.get('/api/alerts', (req, res) => {
  res.json([
    { id: 1, type: 'vaccination', message: 'COVID booster due', priority: 'medium' },
    { id: 2, type: 'outbreak', message: 'Dengue cases in your area', priority: 'high' }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`✅ HealthBot Test Server running on http://localhost:${PORT}`);
  console.log(`✅ Demo Login: user@demo.com / demo123`);
  console.log(`✅ Demo Admin: admin@demo.com / admin123`);
  console.log(`✅ Test endpoints:`);
  console.log(`   - GET  http://localhost:${PORT}/`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   - POST http://localhost:${PORT}/api/chat`);
});