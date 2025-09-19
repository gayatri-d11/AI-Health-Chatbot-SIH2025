const express = require('express');
const router = express.Router();
const axios = require('axios');
const { User, ChatSession } = require('../models/mongodb');

// In-memory chat history (fallback only)
const chatHistories = {};

// Enhanced Language Detection Function - All Indian Languages
function detectLanguage(message) {
  const patterns = {
    'hi': /[\u0900-\u097F]/, // Hindi (Devanagari)
    'en': /^[a-zA-Z\s.,!?]+$/, // English
    'te': /[\u0C00-\u0C7F]/, // Telugu
    'ta': /[\u0B80-\u0BFF]/, // Tamil
    'bn': /[\u0980-\u09FF]/, // Bengali
    'gu': /[\u0A80-\u0AFF]/, // Gujarati
    'mr': /[\u0900-\u097F]/, // Marathi (Devanagari)
    'pa': /[\u0A00-\u0A7F]/, // Punjabi (Gurmukhi)
    'kn': /[\u0C80-\u0CFF]/, // Kannada
    'ml': /[\u0D00-\u0D7F]/, // Malayalam
    'or': /[\u0B00-\u0B7F]/, // Odia
    'as': /[\u0980-\u09FF]/, // Assamese (Bengali script)
    'ur': /[\u0600-\u06FF]/ // Urdu (Arabic script)
  };

  // Check each language pattern
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(message)) {
      return lang;
    }
  }

  return 'hi'; // Default to Hindi
}

// Helper to get and update chat history in MongoDB
async function updateChatHistory(userId, message, aiResponse) {
  try {
    // Save to MongoDB
    let chatSession = await ChatSession.findOne({ userId });
    
    if (!chatSession) {
      chatSession = new ChatSession({ userId, messages: [] });
    }
    
    // Add user message
    chatSession.messages.push({
      type: 'user',
      text: message,
      timestamp: new Date()
    });
    
    // Add AI response
    chatSession.messages.push({
      type: 'bot',
      text: aiResponse,
      timestamp: new Date()
    });
    
    // Keep only last 50 messages
    if (chatSession.messages.length > 50) {
      chatSession.messages = chatSession.messages.slice(-50);
    }
    
    await chatSession.save();
    
    return chatSession.messages.slice(-10); // Return last 10 for context
  } catch (error) {
    console.error('Failed to save chat history:', error);
    // Fallback to in-memory
    if (!chatHistories[userId]) chatHistories[userId] = [];
    chatHistories[userId].push({ 
      user: message, 
      ai: aiResponse, 
      timestamp: new Date().toISOString() 
    });
    if (chatHistories[userId].length > 20) chatHistories[userId].shift();
    return chatHistories[userId];
  }
}

// Build chat context for AI from MongoDB data
function buildChatContext(chatHistory) {
  if (!chatHistory || chatHistory.length === 0) return '';
  
  const recentChats = chatHistory.slice(-10); // Last 10 messages
  let context = '';
  
  for (let i = 0; i < recentChats.length; i += 2) {
    const userMsg = recentChats[i];
    const botMsg = recentChats[i + 1];
    
    if (userMsg && botMsg) {
      context += `Previous - User: "${userMsg.text}" | AI: "${botMsg.text}"\n`;
    }
  }
  
  return context;
}

// Multilingual Gemini AI Integration
async function getMultilingualGeminiResponse(message, detectedLanguage, userPreferredLanguage, chatHistory, forceLanguage = false) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBZgSotGvY1umkF_uCxeRWaTkZnC_q6OVk';
  const responseLanguage = forceLanguage ? userPreferredLanguage : (userPreferredLanguage || detectedLanguage);
  
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
    'gu': 'Respond in Gujarati (ગુજરાતી) script.',
    'mr': 'Respond in Marathi (मराठी) with Devanagari script.',
    'pa': 'Respond in Punjabi (ਪੰਜਾਬੀ) with Gurmukhi script.',
    'kn': 'Respond in Kannada (ಕನ್ನಡ) script.',
    'ml': 'Respond in Malayalam (മലയാളം) script.',
    'or': 'Respond in Odia (ଓଡ଼ିଆ) script.',
    'as': 'Respond in Assamese (অসমীয়া) script.',
    'ur': 'Respond in Urdu (اردو) with Arabic script.'
  };

  const chatContext = buildChatContext(chatHistory);
  
  // Check if user is asking about vaccination
  if (message.toLowerCase().includes('vaccination') || message.toLowerCase().includes('vaccine') ||
      message.toLowerCase().includes('टीका') || message.toLowerCase().includes('वैक्सीन')) {
    try {
      const { findVaccinationCenters } = require('../services/cowin');
      const userLocation = chatHistory.find(msg => 
        msg.text && (msg.text.includes('location') || msg.text.includes('address') || 
                     msg.text.includes('स्थान') || msg.text.includes('पता'))
      )?.text || 'India';
      
      const vaccinationInfo = await findVaccinationCenters(userLocation);
      return {
        response: vaccinationInfo,
        confidence: 0.98,
        source: 'CoWIN API',
        detectedLanguage: detectedLanguage,
        responseLanguage: responseLanguage
      };
    } catch (error) {
      console.log('CoWIN API error, using fallback');
    }
  }
  
  const healthPrompt = `You are Dr. AI - a caring health assistant and caretaker focused ONLY on user's wellbeing.

CRITICAL LANGUAGE RULE:
- YOU MUST RESPOND ONLY IN ${languageInstructions[responseLanguage]}
- DO NOT use any other language in your response
- TRANSLATE everything to the specified language
- If you don't know the language well, use simple words in that language

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

LANGUAGE REQUIREMENT: ${languageInstructions[responseLanguage]}

CHAT HISTORY:
${chatContext}

Current Query: "${message}"

Respond ONLY in the specified language as a caring health caretaker:`;

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

// Medical Knowledge Base - Real Health Information
function getIntelligentFallback(message, language) {
  const lowerMessage = message.toLowerCase();
  
  // Vaccination Information
  if (lowerMessage.includes('vaccination') || lowerMessage.includes('vaccine') || 
      lowerMessage.includes('टीका') || lowerMessage.includes('वैक्सीन')) {
    return {
      response: language === 'hi' ? 
        '💉 **टीकाकरण जानकारी:**\n\n**उपलब्ध टीके:**\n• COVID-19 वैक्सीन\n• फ्लू वैक्सीन\n• बच्चों के टीके\n\n**बुकिंग:**\n• CoWIN पोर्टल: cowin.gov.in\n• आरोग्य सेतु ऐप\n• हेल्पलाइन: 1075\n\n**आवश्यक:** आधार कार्ड/पहचान पत्र' :
        '💉 **Vaccination Information:**\n\n**Available Vaccines:**\n• COVID-19 vaccines\n• Flu vaccines\n• Childhood immunizations\n\n**Booking:**\n• CoWIN Portal: cowin.gov.in\n• Aarogya Setu App\n• Helpline: 1075\n\n**Required:** Aadhaar Card/ID Proof',
      confidence: 0.97,
      source: 'CoWIN Portal',
      responseLanguage: language
    };
  }
  
  // COVID-19 Information
  if (lowerMessage.includes('covid') || lowerMessage.includes('कोविड')) {
    return {
      response: language === 'hi' ? 
        '🦠 **कोविड-19 जानकारी:**\n\n**मुख्य लक्षण:**\n• बुखार (100.4°F से ज्यादा)\n• सूखी खांसी\n• सांस लेने में कठिनाई\n• स्वाद या गंध का न आना\n\n**बचाव:**\n• मास्क पहनें\n• हाथ धोएं\n• सामाजिक दूरी बनाएं\n\n**हेल्पलाइन:** 1075' :
        '🦠 **COVID-19 Information:**\n\n**Main Symptoms:**\n• Fever (>100.4°F)\n• Dry cough\n• Difficulty breathing\n• Loss of taste or smell\n\n**Prevention:**\n• Wear masks\n• Wash hands frequently\n• Maintain social distance\n\n**Helpline:** 1075',
      confidence: 0.98,
      source: 'Ministry of Health & Family Welfare',
      responseLanguage: language
    };
  }
  
  // Fever Management
  if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार')) {
    return {
      response: language === 'hi' ? 
        '🌡️ **बुखार का इलाज:**\n\n**तत्काल राहत:**\n• पैरासिटामोल 500mg (डॉक्टर की सलाह पर)\n• पर्याप्त आराम और तरल पदार्थ\n• ठंडी पट्टी माथे पर\n\n**डॉक्टर से मिलें:**\n• 102°F से ज्यादा बुखार\n• 3 दिन से ज्यादा बुखार\n\n**आपातकाल:** 108' :
        '🌡️ **Fever Treatment:**\n\n**Immediate Relief:**\n• Paracetamol 500mg (as per doctor advice)\n• Adequate rest and fluids\n• Cold compress on forehead\n\n**See Doctor If:**\n• Fever above 102°F\n• Fever persists >3 days\n\n**Emergency:** 108',
      confidence: 0.96,
      source: 'Indian Medical Association Guidelines',
      responseLanguage: language
    };
  }
  
  // Dengue Information
  if (lowerMessage.includes('dengue') || lowerMessage.includes('डेंगू')) {
    return {
      response: language === 'hi' ? 
        '🦟 **डेंगू बुखार:**\n\n**लक्षण:**\n• तेज बुखार\n• सिरदर्द और आंखों में दर्द\n• मांसपेशियों में दर्द\n• चक्कत्ते आना\n\n**बचाव:**\n• मच्छरों से बचें\n• पानी जमा न होने दें\n• मच्छरदानी का इस्तेमाल करें\n\n**आपातकाल:** 108' :
        '🦟 **Dengue Fever:**\n\n**Symptoms:**\n• High fever\n• Severe headache and eye pain\n• Muscle and joint pain\n• Skin rash\n\n**Prevention:**\n• Avoid mosquito bites\n• Remove stagnant water\n• Use mosquito repellent\n\n**Emergency:** 108',
      confidence: 0.97,
      source: 'National Vector Borne Disease Control Programme',
      responseLanguage: language
    };
  }
  
  // General Health Assistant
  return {
    response: language === 'hi' ? 
      '🩺 **Dr. AI - आपका व्यक्तिगत चिकित्सक**\n\nमैं आपकी किसी भी स्वास्थ्य समस्या में मदद कर सकता हूं। कृपया अपने लक्षणों के बारे में विस्तार से बताएं।\n\n**आपातकाल:** 108 | **स्वास्थ्य हेल्पलाइन:** 104' :
      '🩺 **Dr. AI - Your Personal Physician**\n\nI can help with any health concern you have. Please describe your symptoms in detail for a comprehensive medical consultation.\n\n**Emergency:** 108 | **Health Helpline:** 104',
    confidence: 0.92,
    source: 'AI Health Assistant',
    responseLanguage: language
  };
}

// Main chat endpoint
router.post('/', async (req, res) => {
  console.log('Chat request:', req.body);

  try {
    const { message, userId, language: userPreferredLanguage, forceLanguage } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const detectedLanguage = detectLanguage(message);
    
    // Force response language to selected language
    const responseLanguage = forceLanguage ? userPreferredLanguage : (userPreferredLanguage || detectedLanguage);
    
    // Get chat history from MongoDB
    let chatHistory = [];
    try {
      const chatSession = await ChatSession.findOne({ userId });
      chatHistory = chatSession ? chatSession.messages : [];
    } catch (error) {
      console.log('Using fallback chat history');
      chatHistory = chatHistories[userId] || [];
    }
    
    const aiResponse = await getMultilingualGeminiResponse(message, detectedLanguage, responseLanguage, chatHistory, forceLanguage);

    // Save to MongoDB
    await updateChatHistory(userId, message, aiResponse.response);

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