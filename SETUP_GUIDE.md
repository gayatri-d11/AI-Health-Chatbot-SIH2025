# Complete Setup Guide

## 1. Get Telegram Bot Token (2 minutes)
1. Open Telegram → search `@BotFather`
2. Send `/newbot`
3. Name: `Health Assistant Bot`
4. Username: `health_assistant_sih_bot`
5. Copy token → paste in .env as `TELEGRAM_BOT_TOKEN`

## 2. Get Twilio SMS Credentials (3 minutes)
1. Go to https://www.twilio.com/try-twilio
2. Sign up with phone verification
3. Copy Account SID, Auth Token, Phone Number
4. Paste in .env file

## 3. Start Your Bot
```bash
npm start
```

## 4. Set Telegram Webhook (when deploying)
```bash
curl -F "url=https://yourdomain.com/api/telegram/webhook" \
"https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook"
```

## 5. Test Your Bot
- Send "Hi" to your Telegram bot
- Text your Twilio number
- Both should respond with AI health assistance

## Features Working:
✅ Telegram Bot Integration
✅ SMS Integration  
✅ Multilingual AI (10+ languages)
✅ Health Expertise
✅ Emergency Numbers
✅ Government Compliance
✅ Alert Broadcasting