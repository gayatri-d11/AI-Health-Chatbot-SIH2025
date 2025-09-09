const express = require('express');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const router = express.Router();

// Handle incoming voice calls
router.post('/webhook', (req, res) => {
  const twiml = new VoiceResponse();
  
  // Welcome message in Hindi
  twiml.say({
    voice: 'woman',
    language: 'hi-IN'
  }, 'स्वास्थ्य सहायक में आपका स्वागत है। अपना सवाल बोलें।');
  
  // Gather speech input
  const gather = twiml.gather({
    input: 'speech',
    language: 'hi-IN',
    speechTimeout: 'auto',
    action: '/api/voice/process'
  });
  
  gather.say({
    voice: 'woman',
    language: 'hi-IN'
  }, 'बीप के बाद बोलें।');
  
  // Fallback if no input
  twiml.say({
    voice: 'woman',
    language: 'hi-IN'
  }, 'कोई आवाज़ नहीं सुनाई दी। धन्यवाद।');
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Process speech input
router.post('/process', async (req, res) => {
  const { SpeechResult, From } = req.body;
  const twiml = new VoiceResponse();
  
  try {
    // Simple keyword-based responses for demo
    let response = getVoiceResponse(SpeechResult || '');
    
    twiml.say({
      voice: 'woman',
      language: 'hi-IN'
    }, response);
    
    // Option to ask another question
    twiml.say({
      voice: 'woman',
      language: 'hi-IN'
    }, 'कोई और सवाल है तो 1 दबाएं।');
    
    const gather = twiml.gather({
      numDigits: 1,
      action: '/api/voice/continue'
    });
    
  } catch (error) {
    twiml.say({
      voice: 'woman',
      language: 'hi-IN'
    }, 'तकनीकी समस्या है। बाद में कॉल करें।');
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

// Continue conversation
router.post('/continue', (req, res) => {
  const { Digits } = req.body;
  const twiml = new VoiceResponse();
  
  if (Digits === '1') {
    twiml.redirect('/api/voice/webhook');
  } else {
    twiml.say({
      voice: 'woman',
      language: 'hi-IN'
    }, 'धन्यवाद। स्वस्थ रहें।');
    twiml.hangup();
  }
  
  res.type('text/xml');
  res.send(twiml.toString());
});

function getVoiceResponse(speechText) {
  const text = speechText.toLowerCase();
  
  if (text.includes('बुखार') || text.includes('fever')) {
    return 'बुखार में आराम करें, पानी पिएं। 102 डिग्री से ज्यादा हो तो डॉक्टर से मिलें।';
  } else if (text.includes('खांसी') || text.includes('cough')) {
    return 'खांसी में गर्म पानी पिएं, भाप लें। 2 हफ्ते से ज्यादा हो तो जांच कराएं।';
  } else if (text.includes('टीका') || text.includes('vaccine')) {
    return 'सभी जरूरी टीके लगवाएं। कोविड, फ्लू और अन्य टीकों की जानकारी के लिए नजदीकी स्वास्थ्य केंद्र जाएं।';
  } else {
    return 'आपका सवाल समझ नहीं आया। कृपया साफ बोलें या दूसरे शब्दों में पूछें।';
  }
}

module.exports = router;