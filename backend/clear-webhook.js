const axios = require('axios');
require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function clearWebhook() {
  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    console.log('✅ Webhook cleared:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

clearWebhook();