const express = require('express');
const router = express.Router();

// Simple debug chat endpoint (no authentication required for testing)
router.post('/debug', async (req, res) => {
  try {
    console.log('🔍 Debug chat request received:', req.body);
    
    const { message, language = 'en' } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const lowerMessage = message.toLowerCase();
    let response = '';

    // Simple health responses
    if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार')) {
      response = "**Fever Management** 🌡️\n\n• **Rest** and stay hydrated\n• **Paracetamol** 500mg every 6-8 hours\n• Monitor temperature\n\n⚠️ **Call 108 if fever exceeds 103°F**";
    } else if (lowerMessage.includes('headache') || lowerMessage.includes('सिरदर्द')) {
      response = "**Headache Relief** 🤕\n\n• **Rest** in quiet, dark room\n• **Cold compress** on forehead\n• Stay hydrated\n• **Paracetamol** 500mg if needed\n\n⚠️ **Call 108 for severe sudden headache**";
    } else if (lowerMessage.includes('chest pain')) {
      response = "🚨 **MEDICAL EMERGENCY** 🚨\n\n**CALL 108 IMMEDIATELY**\n\nChest pain requires urgent medical attention!";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते')) {
      response = "Hello! I'm YOGIC.ai, your health assistant. 🩺\n\nI can help you with:\n• Health symptoms and care\n• Emergency guidance\n• Medication information\n• Vaccination details\n\nWhat health question can I help you with?";
    } else {
      response = "I understand you have a health concern. For proper medical advice:\n\n• **Consult a healthcare professional**\n• **Call 108** for emergencies\n• **Visit nearest hospital** for serious symptoms\n\nCan you describe your specific symptoms?";
    }

    console.log('✅ Sending response:', response.substring(0, 50) + '...');

    res.json({
      response: response,
      confidence: 0.9,
      source: 'YOGIC.ai Health Database',
      timestamp: new Date(),
      debug: true
    });

  } catch (error) {
    console.error('❌ Debug chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'Sorry, I\'m having technical difficulties. For emergencies, please call **108**.'
    });
  }
});

module.exports = router;