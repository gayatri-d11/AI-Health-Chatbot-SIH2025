const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token || token === 'PUT_NEW_TOKEN_HERE') {
  console.log('❌ Please update TELEGRAM_BOT_TOKEN in .env file');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: { interval: 1000, autoStart: false } });

console.log('🤖 Starting bot...');

bot.startPolling()
  .then(() => {
    console.log('✅ Bot started successfully!');
  })
  .catch((error) => {
    console.log('❌ Error:', error.message);
    if (error.message.includes('409')) {
      console.log('💡 Solution: Get new bot token from @BotFather');
    }
  });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  console.log(`📱 Received: ${text}`);
  
  // Simple intelligent response
  let response = '';
  if (text.toLowerCase().includes('health') || text.includes('स्वास्थ्य')) {
    response = '🏥 I can help with health questions! What specific health concern do you have?';
  } else if (text.toLowerCase().includes('covid')) {
    response = '🦠 COVID symptoms: fever, cough, breathing difficulty. Stay home, get tested. Helpline: 1075';
  } else {
    response = `Hello! You said: "${text}". I'm your health assistant. Ask me about symptoms, diseases, or health advice!`;
  }
  
  bot.sendMessage(chatId, response);
  console.log(`🤖 Sent: ${response}`);
});

console.log('✅ Bot ready! Send messages to test.');