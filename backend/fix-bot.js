const axios = require('axios');
require('dotenv').config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

async function fixBot() {
  console.log('🔧 Fixing Telegram bot...');
  
  try {
    // Step 1: Delete webhook
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`);
    console.log('✅ Webhook deleted');
    
    // Step 2: Stop all updates
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/close`);
    console.log('✅ Bot session closed');
    
    // Step 3: Wait 5 seconds
    console.log('⏳ Waiting 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Step 4: Test bot
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    console.log('✅ Bot is ready:', response.data.result.username);
    
    console.log('\n🚀 Now run: node setup-telegram.js');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixBot();