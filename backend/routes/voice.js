const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/audio/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|webm|ogg|m4a/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Twilio Voice webhook for incoming calls
router.post('/incoming-call', (req, res) => {
  const { From, To } = req.body;
  
  console.log(`📞 Incoming call from ${From} to ${To}`);
  
  // TwiML response for voice call
  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" action="/api/voice/process-speech" method="POST" speechTimeout="3" language="hi-IN">
    <Say voice="Polly.Aditi" language="hi-IN">
      नमस्ते! मैं डॉक्टर AI हूं। आपकी स्वास्थ्य समस्या के बारे में बताएं।
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="hi-IN">
    आपातकाल के लिए 108 डायल करें। धन्यवाद।
  </Say>
</Response>`);
});

// Process speech input from Twilio
router.post('/process-speech', async (req, res) => {
  try {
    const { SpeechResult, From } = req.body;
    
    console.log(`🎤 Speech from ${From}: "${SpeechResult}"`);
    
    if (!SpeechResult) {
      res.set('Content-Type', 'text/xml');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="hi-IN">
    मुझे आपकी बात समझ नहीं आई। कृपया दोबारा कहें।
  </Say>
  <Hangup/>
</Response>`);
    }
    
    // Get AI response (reuse existing chat logic)
    const aiResponse = await getChatResponse(SpeechResult, From, 'hi');
    
    // Convert AI response to speech-friendly format
    const speechText = aiResponse.response
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
      .replace(/•/g, '') // Remove bullet points
      .replace(/\n/g, '. ') // Replace newlines with pauses
      .substring(0, 500); // Limit length for voice
    
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="hi-IN">
    ${speechText}
  </Say>
  <Pause length="2"/>
  <Say voice="Polly.Aditi" language="hi-IN">
    आपातकाल के लिए 108 डायल करें। स्वस्थ रहें।
  </Say>
  <Hangup/>
</Response>`);
    
  } catch (error) {
    console.error('Voice processing error:', error);
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="hi-IN">
    तकनीकी समस्या है। आपातकाल के लिए 108 डायल करें।
  </Say>
  <Hangup/>
</Response>`);
  }
});

// Upload audio file for processing
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }
    
    const audioPath = req.file.path;
    console.log(`🎵 Audio uploaded: ${audioPath}`);
    
    // Here you would integrate with speech-to-text service
    // For now, return a placeholder response
    res.json({
      success: true,
      message: 'Audio uploaded successfully',
      transcript: 'Audio processing not implemented yet',
      audioPath: audioPath
    });
    
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Audio upload failed' });
  }
});

// Get chat response (reuse from chat.js)
async function getChatResponse(message, userId, language) {
  try {
    const axios = require('axios');
    const response = await axios.post('http://localhost:9000/api/chat', {
      message, userId, language
    });
    return response.data;
  } catch (error) {
    return {
      response: 'तकनीकी समस्या है। आपातकाल के लिए 108 डायल करें।',
      confidence: 0.5
    };
  }
}

// Test voice endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Voice API is working!',
    features: [
      'Twilio Voice Calls',
      'Speech Recognition',
      'Text-to-Speech',
      'Audio File Upload'
    ]
  });
});

module.exports = router;