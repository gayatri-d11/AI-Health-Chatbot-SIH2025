const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Replace with your bot token from BotFather
const TELEGRAM_BOT_TOKEN = '8338580267:AAHD3qNS6PL_FsOxITZL88fEruwMkAjiK64';
const API_URL = 'http://localhost:5000/api/chat';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `🩺 Welcome to Dr. AI HealthBot!

I'm your personal health assistant available 24/7.

🌟 What I can help with:
• Health symptoms and advice
• Medication guidance
• Disease prevention tips
• Emergency information
• Multilingual support (10+ languages)

💬 Just type your health question in any language!

🚨 Emergency: Call 108
📞 COVID Helpline: 1075`;

  bot.sendMessage(chatId, welcomeMessage);
});

// Handle all text messages
bot.on('message', async (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const userMessage = msg.text;

    try {
      // Send typing indicator
      bot.sendChatAction(chatId, 'typing');

      // Call your AI API
      const response = await axios.post(API_URL, {
        message: userMessage,
        userId: userId,
        language: 'auto'
      });

      const aiResponse = response.data.response;
      
      // Send AI response
      bot.sendMessage(chatId, aiResponse, {
        parse_mode: 'HTML'
      });

    } catch (error) {
      console.error('Error:', error);
      bot.sendMessage(chatId, '🚨 Sorry, I\'m having technical difficulties. For emergencies, call 108.');
    }
  }
});

// Handle errors
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

console.log('🤖 Telegram Bot is running...');
console.log('📱 Search for your bot on Telegram and start chatting!');