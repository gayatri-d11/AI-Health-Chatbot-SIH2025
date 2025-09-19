# 📱 WhatsApp Chatbot Setup Guide

## Quick Setup Steps

### 1. **Twilio Console Setup**
1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Messaging** → **Try it out** → **Send a WhatsApp message**
3. In **Sandbox Settings**, set the webhook URL to:
   ```
   http://your-domain.com/api/whatsapp/webhook
   ```
   For local testing with ngrok:
   ```
   https://your-ngrok-url.ngrok.io/api/whatsapp/webhook
   ```

### 2. **Install ngrok (for local testing)**
```bash
# Download ngrok from https://ngrok.com/
# Extract and run:
ngrok http 9000
```

### 3. **Configure Webhook**
Copy the ngrok HTTPS URL and set it in Twilio:
```
https://abc123.ngrok.io/api/whatsapp/webhook
```

### 4. **Test WhatsApp Bot**
1. Send `join <sandbox-keyword>` to your Twilio WhatsApp number
2. Send "I have fever" to test the AI response

## Current Configuration
- ✅ Twilio credentials configured
- ✅ WhatsApp webhook endpoint ready
- ✅ AI integration working
- ⚠️ Need to set webhook URL in Twilio console

## WhatsApp Number
Your Twilio WhatsApp number: `+14155238886`

Users can chat by:
1. Sending `join <keyword>` to `+14155238886`
2. Then chatting normally with Dr. AI