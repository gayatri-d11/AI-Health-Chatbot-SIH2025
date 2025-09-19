# 🔐 Environment Setup Guide

## Required API Keys & Credentials

Before running this application, you need to obtain the following API keys and credentials:

### 1. Google Gemini API Key
- Visit: [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Copy the key (starts with `AIzaSy...`)

### 2. Telegram Bot Token
- Message [@BotFather](https://t.me/botfather) on Telegram
- Create a new bot with `/newbot`
- Copy the bot token (format: `123456789:ABC-DEF...`)

### 3. Twilio Credentials (Optional - for WhatsApp/SMS)
- Sign up at [Twilio Console](https://console.twilio.com/)
- Get your Account SID and Auth Token
- Set up a phone number for WhatsApp/SMS

## Setup Instructions

### Step 1: Copy Environment File
```bash
cd backend
cp .env.example .env
```

### Step 2: Edit .env File
Open `backend/.env` and replace the placeholder values:

```env
# Google Gemini AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Telegram Bot Token
TELEGRAM_BOT_TOKEN=your_actual_telegram_bot_token_here

# Twilio Credentials (Optional)
TWILIO_ACCOUNT_SID=your_actual_twilio_sid_here
TWILIO_AUTH_TOKEN=your_actual_twilio_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### Step 3: Verify Setup
```bash
cd backend
node check-keys.js
```

## Security Notes

⚠️ **NEVER commit your actual API keys to GitHub**
- The `.env` file is already in `.gitignore`
- Always use placeholder values in example files
- Keep your actual keys in local `.env` file only

## Troubleshooting

If you get API errors:
1. Verify your API keys are correct
2. Check if APIs are enabled in respective consoles
3. Ensure you have sufficient quota/credits
4. Check network connectivity

## Free Tier Limits

- **Gemini API**: 15 requests/minute
- **Telegram Bot**: Unlimited messages
- **Twilio**: $15 free credit for new accounts