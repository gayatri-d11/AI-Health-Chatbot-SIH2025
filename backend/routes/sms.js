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
    console.log('✅ Twilio SMS service initialized');
  } else {
    console.log('⚠️ Twilio credentials not configured - SMS features disabled');
  }
} catch (error) {
  console.log('⚠️ Twilio initialization failed - SMS features disabled');
}

// SMS webhook
router.post('/webhook', async (req, res) => {
  try {
    const { From, Body } = req.body;
    const userId = `sms_${From}`;
    
    console.log(`SMS from ${From}: ${Body}`);
    
    // Get AI response
    const aiResponse = await getChatResponse(Body, userId, 'hi');
    
    // Send SMS response
    await sendSMS(From, aiResponse.response);
    
    res.sendStatus(200);
  } catch (error) {
    console.error('SMS webhook error:', error);
    res.sendStatus(500);
  }
});

// Send SMS
async function sendSMS(to, message) {
  if (!client) {
    console.log('SMS service not available - Twilio not configured');
    return;
  }
  
  try {
    await client.messages.create({
      body: message.substring(0, 160), // SMS limit
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    });
    
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
}

// Health alert broadcast
router.post('/alert', async (req, res) => {
  try {
    const { message, phoneNumbers } = req.body;
    
    const promises = phoneNumbers.map(number => sendSMS(number, message));
    await Promise.all(promises);
    
    res.json({ success: true, sent: phoneNumbers.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send alerts' });
  }
});

// Get chat response
async function getChatResponse(message, userId, language) {
  try {
    const response = await axios.post('http://localhost:3000/api/chat', {
      message,
      userId,
      language
    });
    return response.data;
  } catch (error) {
    return {
      response: 'स्वास्थ्य: 104 | आपातकाल: 108',
      confidence: 0.5
    };
  }
}

module.exports = router;