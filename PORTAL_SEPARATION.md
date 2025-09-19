# 🚪 Portal Separation Guide

## Overview
The AI-Driven Public Health Chatbot now has **separate login portals** for users and administrators with dedicated demo credentials.

## 🔐 Login Portals

### 👤 User Portal
- **URL:** `/login`
- **Purpose:** Regular users accessing health services
- **Demo Credentials:**
  - Email: `user@healthbot.com`
  - Password: `user123`

### 👑 Admin Portal  
- **URL:** `/admin-login`
- **Purpose:** System administrators managing the platform
- **Demo Credentials:**
  - Email: `admin@healthbot.com`
  - Password: `admin123`

## 🎯 Features

### User Portal Features
- ✅ AI Health Consultation
- ✅ Multilingual Support (10+ languages)
- ✅ Health Quiz & Assessments
- ✅ Personal Health Dashboard
- ✅ Chat History & Memory
- ✅ Health Alerts & Notifications

### Admin Portal Features
- ✅ User Management & Analytics
- ✅ Health Alert Broadcasting
- ✅ System Configuration
- ✅ Chat Monitoring & Reports
- ✅ Content Management
- ✅ Emergency Alert System

## 🔒 Security Features

### Authentication Separation
- **Role-based Access Control:** Users cannot access admin features
- **Portal Isolation:** Admin users redirected to admin portal
- **Demo Account Protection:** Demo emails cannot be registered by others

### Demo Credentials
- **Pre-configured Users:** Ready-to-use demo accounts
- **One-click Login:** "Use Demo" buttons for quick access
- **Realistic Data:** Demo accounts have sample health data

## 🚀 Quick Start

### For Users
1. Visit the homepage
2. Click "Login" → "User Portal"
3. Click "Use Demo" button or enter:
   - Email: `user@healthbot.com`
   - Password: `user123`
4. Access your health dashboard

### For Admins
1. Visit the homepage  
2. Click "Login" → "Admin Portal"
3. Click "Use Demo" button or enter:
   - Email: `admin@healthbot.com`
   - Password: `admin123`
4. Access admin dashboard

## 🛠️ Technical Implementation

### Frontend Routes
```
/login          → User Login Page
/admin-login    → Admin Login Page
/dashboard      → User Dashboard
/admin          → Admin Dashboard
```

### Backend Authentication
```javascript
// Separate login validation
POST /api/auth/login
{
  "email": "user@healthbot.com",
  "password": "user123",
  "loginType": "user" | "admin"
}
```

### Demo User Data
```javascript
// User Demo Account
{
  name: "Demo User",
  email: "user@healthbot.com", 
  role: "user",
  location: "Mumbai, Maharashtra",
  medicalConditions: ["Diabetes"],
  totalQuizPoints: 150
}

// Admin Demo Account  
{
  name: "Admin User",
  email: "admin@healthbot.com",
  role: "admin", 
  location: "Delhi, India"
}
```

## 🎨 UI/UX Improvements

### Landing Page
- **Dropdown Login Menu:** Choose between User/Admin portals
- **Clear Portal Distinction:** Different colors and icons
- **Demo Credential Banners:** Visible demo login options

### Login Pages
- **Portal-specific Branding:** Different themes for user vs admin
- **Demo Credential Cards:** One-click demo login
- **Cross-portal Navigation:** Easy switching between portals

## 📱 Access Methods

### User Portal Access
- Web Dashboard: `http://localhost:3000/login`
- Telegram Bot: `@rural_health_assistant_bot`
- WhatsApp: `+91-98765-43210`
- SMS: `+91-98765-43210`

### Admin Portal Access
- Web Dashboard: `http://localhost:3000/admin-login`
- Direct Admin Setup: `http://localhost:3000/admin-setup`

## 🔧 Environment Variables
```env
# Demo Credentials
DEMO_USER_EMAIL=user@healthbot.com
DEMO_USER_PASSWORD=user123
DEMO_ADMIN_EMAIL=admin@healthbot.com
DEMO_ADMIN_PASSWORD=admin123
```

## 🚨 Important Notes

1. **Demo Accounts:** Pre-configured for immediate testing
2. **Role Validation:** Backend enforces role-based access
3. **Portal Separation:** Users cannot access admin features
4. **Real Registration:** New users can still register normally
5. **Admin Setup:** First-time admin creation still available

---

**Ready to test!** 🎉 Use the demo credentials to explore both user and admin experiences.