const express = require('express');
const axios = require('axios');
const router = express.Router();

// WhatsApp webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive WhatsApp messages
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(async (entry) => {
        const changes = entry.changes?.[0];
        const value = changes?.value;
        const messages = value?.messages;

        if (messages?.[0]) {
          const message = messages[0];
          const from = message.from;
          const messageBody = message.text?.body;

          if (messageBody) {
            console.log(`WhatsApp message from ${from}: ${messageBody}`);
            
            // Get AI response
            const aiResponse = await getChatResponse(messageBody, from, 'hi');
            
            // Send response back
            await sendWhatsAppMessage(from, aiResponse.response);
          }
        }
      });
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

// Send WhatsApp message
async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    await axios.post(url, {
      messaging_product: 'whatsapp',
      to: to,
      text: { body: message }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`WhatsApp message sent to ${to}`);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Get chat response (reuse existing chat logic)
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
      response: 'स्वास्थ्य सहायता के लिए 104 डायल करें। Emergency: 108',
      confidence: 0.5
    };
  }
}

module.exports = router;