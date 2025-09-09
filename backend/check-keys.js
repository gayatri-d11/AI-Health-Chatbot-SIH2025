const axios = require('axios');
require('dotenv').config();

async function checkKeys() {
  console.log('🔍 Checking API Keys...\n');
  
  // Check Gemini API Key
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log('1. Gemini API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  
  if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('Dummy')) {
    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        contents: [{ parts: [{ text: 'Hello, test message' }] }]
      });
      
      if (response.status === 200) {
        console.log('   ✅ Gemini API is working!');
      } else {
        console.log('   ❌ Gemini API error:', response.status);
      }
    } catch (error) {
      console.log('   ❌ Gemini API error:', error.message);
    }
  } else {
    console.log('   ❌ Invalid Gemini API key');
  }
  
  // Check Telegram Bot Token
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  console.log('\n2. Telegram Bot Token:', TELEGRAM_BOT_TOKEN ? `${TELEGRAM_BOT_TOKEN.substring(0, 10)}...` : 'NOT FOUND');
  
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_BOT_TOKEN !== 'PUT_NEW_TOKEN_HERE') {
    try {
      const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
      const data = response.data;
      
      if (data.ok) {
        console.log('   ✅ Telegram Bot is working!');
        console.log('   🤖 Bot username:', data.result.username);
      } else {
        console.log('   ❌ Telegram Bot error:', data.description);
      }
    } catch (error) {
      console.log('   ❌ Telegram Bot error:', error.message);
    }
  } else {
    console.log('   ❌ Please update TELEGRAM_BOT_TOKEN in .env file');
    console.log('   💡 Go to @BotFather → /mybots → select bot → regenerate token');
  }
}

checkKeys();