const express = require('express');
const cors = require('cors');

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
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/sms', require('./routes/sms'));

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
  console.log(`✅ Demo Login: user@demo.com / demo123`);
  console.log(`✅ Demo Admin: admin@demo.com / admin123`);
});