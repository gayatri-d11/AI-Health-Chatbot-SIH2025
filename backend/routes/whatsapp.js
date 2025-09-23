const express = require('express');
const router = express.Router();

// WhatsApp webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === 'your_verify_token') {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// Handle WhatsApp messages (from n8n)
router.post('/webhook', (req, res) => {
  console.log('WhatsApp webhook received:', req.body);
  res.status(200).send('OK');
});

module.exports = router;