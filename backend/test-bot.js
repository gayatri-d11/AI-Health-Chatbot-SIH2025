const axios = require('axios');
require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function testBot() {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    console.log('✅ Bot info:', response.data);
    console.log('🤖 Your bot is working! Username:', response.data.result.username);
  } catch (error) {
    console.error('❌ Bot error:', error.message);
  }
}

testBot();