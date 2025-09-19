@echo off
echo ========================================
echo    WhatsApp Chatbot Setup
echo ========================================
echo.
echo 1. Download ngrok from: https://ngrok.com/download
echo 2. Extract ngrok.exe to this folder
echo 3. Run: ngrok http 9000
echo 4. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
echo 5. Go to Twilio Console: https://console.twilio.com/
echo 6. Navigate to Messaging > Try it out > Send a WhatsApp message
echo 7. Set webhook URL to: https://your-ngrok-url.ngrok.io/api/whatsapp/webhook
echo.
echo Your WhatsApp number: +14155238886
echo Users send "join <keyword>" first, then chat normally
echo.
echo Backend is running on: http://localhost:9000
echo WhatsApp webhook endpoint: /api/whatsapp/webhook
echo.
pause