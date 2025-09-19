# 🎤 Voice Integration Setup Commands

## Install Backend Dependencies
```bash
cd backend
npm install multer
```

## Environment Variables (Add to .env)
```env
# Voice Features
ENABLE_VOICE=true
TWILIO_VOICE_WEBHOOK_URL=https://your-domain.com/api/voice/incoming-call
```

## Test Voice Features

### 1. Test Web Voice Interface
1. Start frontend: `npm start`
2. Go to chat interface
3. Click "Voice ON" button
4. Click microphone and speak
5. AI response will be spoken back

### 2. Test Twilio Voice Calls (Optional)
1. Configure Twilio phone number webhook:
   ```
   https://your-domain.com/api/voice/incoming-call
   ```
2. Call your Twilio number
3. Speak your health question
4. Hear AI response

## Browser Requirements
- **HTTPS required** for microphone access
- **Chrome/Firefox** recommended
- **User permission** needed for microphone

## Supported Languages
- Hindi (hi-IN)
- English (en-US)
- Telugu (te-IN)
- Tamil (ta-IN)
- Bengali (bn-IN)
- Gujarati (gu-IN)

## Features Added
✅ **Voice Input** - Speak your questions
✅ **Voice Output** - Hear AI responses
✅ **Multi-language** - Voice in Indian languages
✅ **Voice Toggle** - Enable/disable voice
✅ **Twilio Voice Calls** - Phone call integration
✅ **Audio Upload** - File-based voice input

## Next Steps
1. **Test web voice** interface first
2. **Configure Twilio** for phone calls (optional)
3. **Add voice commands** (emergency, repeat, etc.)
4. **Optimize audio quality** and speed