const express = require('express');
const fetch = require('node-fetch');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Direct Gemini AI function
async function getGeminiResponse(message) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  const prompt = `You are an intelligent AI assistant. Answer any question helpfully and conversationally. For health questions, provide detailed medical advice.

User asks: "${message}"

Respond helpfully:`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
      })
    });

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response');
  } catch (error) {
    return 'I can help with any questions! Emergency: 108 | Health: 104';
  }
}

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (message && message.text) {
      const chatId = message.chat.id;
      const userMessage = message.text;
      
      console.log(`📱 Message: ${userMessage}`);
      
      // Get AI response
      const aiResponse = await getGeminiResponse(userMessage);
      console.log(`🤖 Response: ${aiResponse}`);
      
      // Send response
      await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: aiResponse
      });
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
});

app.listen(3001, () => {
  console.log('🤖 Webhook bot running on port 3001');
  console.log('✅ No polling conflicts!');
});