# 🩺 AI Health Chatbot - Complete Setup Guide

## 🚀 Quick Start (Automated)

**Option 1: One-Click Setup**
```bash
# Double-click this file to auto-setup everything:
setup-and-run.bat
```

**Option 2: Manual Setup**

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (already configured)
- Internet connection

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend  
npm install
```

### Step 2: Environment Setup
The `.env` file is already configured with:
- ✅ MongoDB Atlas connection
- ✅ Google Gemini AI API key
- ✅ All required environment variables

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api
- **Health Check:** http://localhost:3000/health

## 👤 Demo Accounts

### User Account
- **Email:** user@demo.com
- **Password:** demo123
- **Features:** Chat, Quiz, Health Alerts

### Admin Account  
- **Email:** admin@demo.com
- **Password:** admin123
- **Features:** Full admin panel, user management, analytics

## 🎯 Key Features Working

### ✅ Intelligent Chatbot
- **AI Engine:** Google Gemini 1.5 Flash
- **Languages:** Hindi, English, Telugu, Tamil, Bengali, Gujarati
- **Capabilities:** 
  - Medical symptom analysis
  - Disease information
  - Medication guidance
  - Emergency support
  - Conversational memory

### ✅ Interactive Health Quiz
- **Always Active:** Quiz runs continuously
- **Multilingual:** Available in 6+ Indian languages
- **Smart Scoring:** AI-powered health assessment
- **Personalized Results:** Custom recommendations
- **Progress Tracking:** Saves user responses to MongoDB

### ✅ Real-time Health Alerts
- Disease outbreak notifications
- Vaccination reminders
- Seasonal health tips
- Emergency contact integration

### ✅ Admin Dashboard
- User management
- Health alert creation
- System analytics
- Real-time monitoring

## 🛠️ Technical Stack

### Backend
- **Framework:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **AI:** Google Gemini 1.5 Flash
- **Authentication:** JWT-based
- **APIs:** RESTful architecture

### Frontend
- **Framework:** React.js 18
- **Styling:** TailwindCSS + Custom CSS
- **State Management:** React Hooks + Context
- **Routing:** React Router v6
- **UI Components:** Custom responsive design

## 📱 API Endpoints

### Chat System
```
POST /api/chat - Send message to AI
GET  /api/chat/test - Test AI connection
```

### Quiz System
```
POST /api/quiz/question - Get quiz question
POST /api/quiz/submit - Submit answer
POST /api/quiz/results - Get quiz results
GET  /api/quiz/tip - Daily health tip
```

### Authentication
```
POST /api/auth/login - User login
POST /api/auth/register - User registration
```

### Health Alerts
```
GET  /api/alerts - Get active alerts
POST /api/alerts - Create new alert (admin)
```

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Check internet connection
- Verify MongoDB Atlas URL in .env
- Ensure IP whitelist includes your IP

**2. Gemini AI Not Responding**
- API key is already configured
- Check internet connection
- Fallback responses will work offline

**3. Frontend Not Loading**
- Ensure both backend and frontend are running
- Check ports 3000 (backend) and 3001 (frontend)
- Clear browser cache

**4. Quiz Not Working**
- Backend must be running first
- Check MongoDB connection
- Verify API endpoints are accessible

### Port Configuration
If ports are busy, modify:

**Backend (server.js):**
```javascript
const PORT = process.env.PORT || 3000;
```

**Frontend (package.json):**
```json
"start": "PORT=3001 react-scripts start"
```

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String,
  password: String,
  role: String,
  totalQuizPoints: Number,
  quizResponses: [Object],
  chatHistory: [Object]
}
```

### Health Alerts Collection
```javascript
{
  disease: String,
  message: String,
  severity: String,
  location: String,
  isActive: Boolean
}
```

## 🚨 Emergency Features

The app includes integrated emergency support:
- **108** - National Emergency
- **1075** - COVID Helpline  
- **104** - Health Helpline
- **1091** - Women Helpline

## 🎨 UI Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Accessibility compliant

### Interactive Elements
- Smooth animations
- Real-time typing indicators
- Progress bars
- Loading states
- Error handling

## 🔐 Security Features

- Input sanitization
- XSS protection
- CORS configuration
- Rate limiting ready
- Secure MongoDB connection

## 📈 Performance

- Optimized API responses
- Efficient database queries
- Lazy loading components
- Caching strategies
- Error boundaries

## 🌟 Production Deployment

### Backend (Render/Heroku)
```bash
# Set environment variables
MONGO_URL=your_mongodb_url
GEMINI_API_KEY=your_api_key
NODE_ENV=production
```

### Frontend (Netlify/Vercel)
```bash
# Build command
npm run build

# Publish directory
build/
```

## 📞 Support

For technical issues:
1. Check this README
2. Verify all dependencies installed
3. Ensure MongoDB connection
4. Check browser console for errors

## 🏆 SIH 2024 Compliance

This project addresses:
- ✅ Rural healthcare accessibility
- ✅ Multilingual support (10+ languages)
- ✅ AI-powered medical assistance
- ✅ Government integration ready
- ✅ Scalable architecture
- ✅ Emergency services integration

---

**Made with ❤️ for Smart India Hackathon 2024**