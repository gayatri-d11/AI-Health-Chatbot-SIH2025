const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

console.log('🤖 Telegram bot started with polling...');

// Direct Gemini AI function
async function getGeminiResponse(message, language = 'en') {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  const prompt = `You are an intelligent, helpful AI assistant. Answer any question the user asks in a friendly, conversational way. If it's about health, provide detailed medical advice. For other topics, be knowledgeable and engaging.

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
    console.error('Gemini Error:', error);
    return 'I can help with health questions. Emergency: 108 | Health: 104';
  }
}

// Handle messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  
  console.log(`📱 Message from ${msg.from.first_name}: ${userMessage}`);
  
  try {
    // Get direct Gemini AI response
    const aiResponse = await getGeminiResponse(userMessage);
    console.log(`🤖 Sending: ${aiResponse}`);
    
    // Send response back
    await bot.sendMessage(chatId, aiResponse);
    
  } catch (error) {
    console.error('Error:', error.message);
    await bot.sendMessage(chatId, 'I can help with any questions! Emergency: 108');
  }
});

console.log('✅ Bot is ready! Send a message to test.');