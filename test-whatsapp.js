// Test WhatsApp webhook locally
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Test webhook endpoint
app.post('/api/whatsapp/webhook', (req, res) => {
  console.log('WhatsApp webhook received:', req.body);
  
  const { From, Body } = req.body;
  console.log(`Message from ${From}: ${Body}`);
  
  // Simulate AI response
  const response = `🤖 Dr. AI: I received your message "${Body}". For fever, rest and stay hydrated. Call 108 for emergencies.`;
  
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Message>${response}</Message>
    </Response>
  `);
});

app.listen(3001, () => {
  console.log('WhatsApp test server running on http://localhost:3001');
  console.log('Webhook URL: http://localhost:3001/api/whatsapp/webhook');
});