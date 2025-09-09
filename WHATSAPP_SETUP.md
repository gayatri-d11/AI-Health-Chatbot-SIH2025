# WhatsApp Business API Setup

## 1. Create Meta Developer Account
- Go to https://developers.facebook.com/
- Create account and verify phone number
- Create new app → Business → WhatsApp

## 2. Get Credentials
- Phone Number ID: From WhatsApp → API Setup
- Access Token: From WhatsApp → API Setup  
- Verify Token: Create your own (e.g., "health_bot_verify_123")
- Webhook URL: https://yourdomain.com/api/whatsapp/webhook

## 3. Add to .env file
```
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=health_bot_verify_123
```