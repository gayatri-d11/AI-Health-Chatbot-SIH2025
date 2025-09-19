# 🚀 Deploy to Render (Free Cloud Hosting)

## Quick Deploy Steps:

### 1. Create Render Account
Go to https://render.com → Sign up (free)

### 2. Connect GitHub
- Upload your SIH project to GitHub
- Connect GitHub to Render

### 3. Deploy Backend
- New Web Service
- Connect your GitHub repo
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Environment Variables: Copy from your .env

### 4. Get Your URL
Render gives you: `https://your-app.onrender.com`

### 5. Set Twilio Webhook
Use: `https://your-app.onrender.com/api/whatsapp/webhook`

## Benefits:
- ✅ No ngrok needed
- ✅ Always online
- ✅ HTTPS by default
- ✅ Free tier available