const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const connectDB = async () => {
  try {
    if (process.env.MONGO_URL && process.env.MONGO_URL !== 'your_mongodb_url_here') {
      await mongoose.connect(process.env.MONGO_URL);
      console.log('✅ MongoDB Connected Successfully');
    } else {
      console.log('⚠️ MongoDB not configured - using in-memory storage');
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.log('⚠️ Continuing without MongoDB - using in-memory storage');
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  phone: String,
  age: Number,
  location: String,
  language: { type: String, default: 'hi' },
  medicalConditions: [String],
  totalQuizPoints: { type: Number, default: 0 },
  chatHistory: [{
    message: String,
    response: String,
    timestamp: { type: Date, default: Date.now }
  }],
  quizResponses: [{
    questionIndex: Number,
    answer: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Health Alert Schema
const alertSchema = new mongoose.Schema({
  alertType: String,
  disease: String,
  message: String,
  severity: { type: String, enum: ['low', 'medium', 'high'] },
  location: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Chat Session Schema
const chatSessionSchema = new mongoose.Schema({
  userId: String,
  messages: [{
    type: { type: String, enum: ['user', 'bot'] },
    text: String,
    timestamp: { type: Date, default: Date.now },
    confidence: Number,
    source: String
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Alert = mongoose.model('Alert', alertSchema);
const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = { connectDB, User, Alert, ChatSession };