const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory chat history (for demo; use DB for production)
const chatHistories = {};

// Language Detection Function
function detectLanguage(message) {
  const hindiPattern = /[\u0900-\u097F]/;
  const englishPattern = /^[a-zA-Z\s.,!?]+$/;
  const teluguPattern = /[\u0C00-\u0C7F]/;
  const tamilPattern = /[\u0B80-\u0BFF]/;
  const bengaliPattern = /[\u0980-\u09FF]/;
  const gujaratiPattern = /[\u0A80-\u0AFF]/;

  if (hindiPattern.test(message)) return 'hi';
  if (teluguPattern.test(message)) return 'te';
  if (tamilPattern.test(message)) return 'ta';
  if (bengaliPattern.test(message)) return 'bn';
  if (gujaratiPattern.test(message)) return 'gu';
  if (englishPattern.test(message)) return 'en';

  return 'hi'; // Default to Hindi
}

// Helper to get and update chat history
function updateChatHistory(userId, message, aiResponse) {
  if (!chatHistories[userId]) chatHistories[userId] = [];
  chatHistories[userId].push({ 
    user: message, 
    ai: aiResponse, 
    timestamp: new Date().toISOString() 
  });
  if (chatHistories[userId].length > 20) chatHistories[userId].shift();
  return chatHistories[userId];
}

// Build chat context for AI
function buildChatContext(chatHistory) {
  if (!chatHistory || chatHistory.length === 0) return '';
  
  const recentChats = chatHistory.slice(-5); // Last 5 conversations
  return recentChats.map(chat => 
    `Previous - User: "${chat.user}" | AI: "${chat.ai}"`
  ).join('\n');
}

// Multilingual Gemini AI Integration
async function getMultilingualGeminiResponse(message, detectedLanguage, userPreferredLanguage, chatHistory) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBZgSotGvY1umkF_uCxeRWaTkZnC_q6OVk';
  const responseLanguage = userPreferredLanguage || detectedLanguage;
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('Dummy')) {
    console.error('Gemini API key not found, using fallback');
    return getIntelligentFallback(message, responseLanguage);
  }

  const languageInstructions = {
    'hi': 'Respond in Hindi (हिंदी) with Devanagari script.',
    'en': 'Respond in clear, simple English.',
    'te': 'Respond in Telugu (తెలుగు) script.',
    'ta': 'Respond in Tamil (தமிழ்) script.',
    'bn': 'Respond in Bengali (বাংলা) script.',
    'gu': 'Respond in Gujarati (ગુજરાતી) script.'
  };

  const chatContext = buildChatContext(chatHistory);
  
  const healthPrompt = `You are Dr. AI - a caring health assistant and caretaker focused ONLY on user's wellbeing.

IMPORTANT RULES:
- Act like a caring health caretaker, always concerned about user's health
- REMEMBER previous conversations and follow up on past health issues
- Ask about previous symptoms/conditions mentioned in chat history
- Predict next medications and care based on conversation history
- Provide personalized advice based on user's health journey
- NEVER ask or discuss personal/confidential information
- Provide vaccination updates and disease alerts for user's area
- NEVER give scary answers that cause fear about serious diseases
- Always be reassuring and supportive while being medically accurate
- Focus on prevention, wellness, and positive health outcomes
- If non-health topics: "I am not made for answering such questions. Stick to health topics only."
- Keep responses caring but concise
- Use bullet points (•) for lists
- NO asterisks (*) for bold text

${languageInstructions[responseLanguage]}

CHAT HISTORY:
${chatContext}

Current Query: "${message}"

Respond as a caring health caretaker who remembers past conversations:`;

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: healthPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const data = response.data;
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      return {
        response: data.candidates[0].content.parts[0].text,
        confidence: 0.96,
        source: 'Google Gemini AI',
        detectedLanguage: detectedLanguage,
        responseLanguage: responseLanguage
      };
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return getIntelligentFallback(message, responseLanguage);
  }
}

// Professional Medical Fallback
function getIntelligentFallback(message, language) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('covid') || lowerMessage.includes('कोविड')) {
    return {
      response: language === 'hi' ? 
        '🦠 कोविड-19 लक्षण:\n\n• बुखार\n• खांसी\n• सांस लेने में कठिनाई\n\nहेल्पलाइन: 1075' :
        '🦠 COVID-19 Symptoms:\n\n• Fever\n• Cough\n• Difficulty breathing\n\nHelpline: 1075',
      confidence: 0.95,
      source: 'Dr. AI Medical Database',
      responseLanguage: language
    };
  }
  
  if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार')) {
    return {
      response: language === 'hi' ? 
        '🌡️ बुखार का इलाज:\n\n• आराम करें\n• पानी पिएं\n• पैरासिटामोल लें\n\nआपातकाल: 108' :
        '🌡️ Fever Treatment:\n\n• Take rest\n• Drink fluids\n• Take paracetamol\n\nEmergency: 108',
      confidence: 0.95,
      source: 'Dr. AI Medical Database',
      responseLanguage: language
    };
  }
  
  return {
    response: language === 'hi' ? 
      '🩺 Dr. AI\n\nमैं आपकी स्वास्थ्य समस्याओं में मदद कर सकता हूं।\n\nआपातकाल: 108' :
      '🩺 Dr. AI\n\nI can help with your health concerns.\n\nEmergency: 108',
    confidence: 0.90,
    source: 'Dr. AI',
    responseLanguage: language
  };
}

// Main chat endpoint
router.post('/', async (req, res) => {
  console.log('Chat request:', req.body);

  try {
    const { message, userId, language: userPreferredLanguage } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const detectedLanguage = detectLanguage(message);
    const chatHistory = chatHistories[userId] || [];
    const aiResponse = await getMultilingualGeminiResponse(message, detectedLanguage, userPreferredLanguage, chatHistory);

    updateChatHistory(userId, message, aiResponse.response);

    res.json({
      response: aiResponse.response,
      confidence: aiResponse.confidence,
      detectedLanguage: aiResponse.detectedLanguage,
      responseLanguage: aiResponse.responseLanguage,
      source: aiResponse.source
    });

  } catch (error) {
    console.error('Chat error:', error);
    const errorLanguage = req.body.language || 'hi';
    const errorMessages = {
      hi: '🚨 तकनीकी समस्या है। आपातकाल के लिए 108 डायल करें।',
      en: '🚨 Technical issue. For emergency dial 108.'
    };

    res.status(500).json({
      error: 'Service temporarily unavailable',
      response: errorMessages[errorLanguage] || errorMessages.hi,
      confidence: 0.5,
      responseLanguage: errorLanguage
    });
  }
});

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'AI Chat API is working!',
    ai_engine: 'Google Gemini',
    languages_supported: 6,
    status: 'active'
  });
});

module.exports = router;