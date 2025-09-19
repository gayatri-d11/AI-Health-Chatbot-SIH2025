const express = require('express');
const axios = require('axios');
const router = express.Router();

// Initialize Twilio only if credentials are provided
let client = null;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    const twilio = require('twilio');
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('✅ Twilio WhatsApp service initialized');
  } else {
    console.log('⚠️ Twilio credentials not configured - WhatsApp features disabled');
  }
} catch (error) {
  console.log('⚠️ Twilio initialization failed - WhatsApp features disabled');
}

// WhatsApp webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('========================');
    
    const { From, Body, ProfileName } = req.body;
    const userPhone = From;
    const userMessage = Body;
    const userName = ProfileName || 'User';
    
    console.log(`📱 WhatsApp message from ${userName} (${userPhone}): "${userMessage}"`);
    
    if (!userMessage || !userMessage.trim()) {
      console.log('❌ Empty message, sending 200');
      return res.sendStatus(200);
    }
    
    // Get AI response
    console.log('🤖 Getting AI response...');
    const aiResponse = await getChatResponse(userMessage, userPhone, 'hi');
    console.log('✅ AI Response received:', aiResponse.response.substring(0, 100) + '...');
    
    // Return TwiML response
    res.set('Content-Type', 'text/xml');
    const response = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>🤖 Dr. AI: ${aiResponse.response}</Message>
</Response>`;
    
    console.log('📤 Sending TwiML response');
    res.send(response);
  } catch (error) {
    console.error('❌ WhatsApp webhook error:', error);
    res.set('Content-Type', 'text/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>🏥 Dr. AI: Sorry, I'm having technical issues. For emergencies call 108.</Message>
</Response>`);
  }
});

// Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  if (!client) {
    console.log('WhatsApp service not available - Twilio not configured');
    return;
  }
  
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_NUMBER, // whatsapp:+14155238886
      to: to // whatsapp:+919876543210
    });
    
    console.log(`WhatsApp message sent to ${to}`);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Get chat response from AI
async function getChatResponse(message, userId, language) {
  try {
    const response = await axios.post('http://localhost:9000/api/chat', {
      message,
      userId,
      language
    });
    return response.data;
  } catch (error) {
    return {
      response: '🏥 स्वास्थ्य सहायता: 104 | आपातकाल: 108\n\nDr. AI temporarily unavailable. For emergencies, call 108.',
      confidence: 0.5
    };
  }
}

// Send WhatsApp health alert to multiple users
router.post('/send-alert', async (req, res) => {
  try {
    const { message, phoneNumbers } = req.body;
    
    if (!client) {
      return res.status(500).json({ error: 'WhatsApp service not configured' });
    }
    
    const promises = phoneNumbers.map(number => {
      const whatsappNumber = number.startsWith('whatsapp:') ? number : `whatsapp:${number}`;
      return sendWhatsAppMessage(whatsappNumber, message);
    });
    
    await Promise.all(promises);
    
    res.json({ success: true, sent: phoneNumbers.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send WhatsApp alerts' });
  }
});

// Test WhatsApp message endpoint
router.post('/test', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!client) {
      return res.status(500).json({ error: 'WhatsApp service not configured' });
    }
    
    const whatsappNumber = phone.startsWith('whatsapp:') ? phone : `whatsapp:${phone}`;
    await sendWhatsAppMessage(whatsappNumber, message || 'Hello from Dr. AI HealthBot! 🤖');
    
    res.json({ success: true, message: 'Test message sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send test message' });
  }
});

module.exports = router;