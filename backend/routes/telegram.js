const express = require('express');
const axios = require('axios');
const router = express.Router();

// Initialize Telegram bot only if token is provided
let bot = null;
try {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your_telegram_bot_token_here') {
    const TelegramBot = require('node-telegram-bot-api');
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
    console.log('✅ Telegram bot initialized');
  } else {
    console.log('⚠️ Telegram bot token not configured');
  }
} catch (error) {
  console.log('⚠️ Telegram bot initialization failed:', error.message);
}

// Telegram webhook
router.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (message && message.text) {
      const chatId = message.chat.id;
      const userMessage = message.text;
      const userId = `telegram_${message.from.id}`;
      
      console.log(`Telegram message from ${userId}: ${userMessage}`);
      
      // Get AI response
      const aiResponse = await getChatResponse(userMessage, userId, 'hi');
      
      // Send response
      if (bot) {
        await bot.sendMessage(chatId, aiResponse.response);
      } else {
        console.log('Telegram bot not available');
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Telegram webhook error:', error);
    res.sendStatus(500);
  }
});

// Get chat response
async function getChatResponse(message, userId, language) {
  try {
    const response = await axios.post('http://localhost:3000/api/chat', {
      message,
      userId,
      language
    });
    return response.data;
  } catch (error) {
    return {
      response: '🏥 स्वास्थ्य सहायता: 104 | आपातकाल: 108',
      confidence: 0.5
    };
  }
}

module.exports = router;