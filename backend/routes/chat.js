const express = require('express');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Simple but intelligent health response system
const generateHealthResponse = async (message, language = 'en', chatHistory = []) => {
  const lowerMessage = message.toLowerCase();
  
  // Emergency detection
  const emergencyKeywords = [
    'chest pain', 'can\'t breathe', 'difficulty breathing', 'heart attack', 
    'unconscious', 'severe bleeding', 'choking', 'suicide',
    'छाती में दर्द', 'सांस नहीं आ रही', 'दिल का दौरा', 'बेहोश'
  ];
  
  if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return {
      response: "🚨 **MEDICAL EMERGENCY DETECTED** 🚨\n\n**CALL 108 IMMEDIATELY**\n\nThis requires urgent medical attention. Do not delay seeking professional help.",
      confidence: 1.0,
      source: 'Emergency Protocol'
    };
  }

  // Health condition responses
  const healthResponses = {
    fever: {
      en: "**Fever Management Guidelines** (Source: Ministry of Health)\n\n**Immediate Care:**\n• **Rest** and stay hydrated\n• **Paracetamol** 500mg every 6-8 hours (max 4g/day)\n• Use cold compress on forehead\n• Monitor temperature regularly\n\n⚠️ **Seek Medical Help If:**\n• Fever above **103°F (39.4°C)**\n• Persists for more than **3 days**\n• Accompanied by severe symptoms\n\n**Emergency: Call 108**",
      hi: "**बुखार का प्रबंधन** (स्रोत: स्वास्थ्य मंत्रालय)\n\n**तत्काल देखभाल:**\n• **आराम** करें और पानी पिएं\n• **पैरासिटामोल** 500mg हर 6-8 घंटे में\n• माथे पर ठंडी पट्टी रखें\n• तापमान की निगरानी करें\n\n⚠️ **डॉक्टर से मिलें यदि:**\n• बुखार **103°F से अधिक**\n• **3 दिन से अधिक** रहे\n\n**आपातकाल: 108 पर कॉल करें**"
    },
    headache: {
      en: "**Headache Relief Guidelines** (Source: AIIMS)\n\n**Home Remedies:**\n• **Rest** in quiet, dark room\n• Apply **cold/warm compress**\n• Stay **hydrated** (8-10 glasses water)\n• Gentle neck massage\n\n**Medication:**\n• **Paracetamol** 500mg or **Ibuprofen** 400mg\n• Avoid overuse of painkillers\n\n⚠️ **Warning Signs:**\n• **Sudden severe headache**\n• Headache with fever and neck stiffness\n• **Call 108 for emergency**",
      hi: "**सिरदर्द राहत दिशानिर्देश** (स्रोत: AIIMS)\n\n**घरेलू उपचार:**\n• शांत, अंधेरे कमरे में **आराम**\n• **ठंडी/गर्म पट्टी** लगाएं\n• **पानी पिएं** (8-10 गिलास)\n• गर्दन की हल्की मालिश\n\n**दवा:**\n• **पैरासिटामोल** 500mg या **इबुप्रोफेन** 400mg\n\n⚠️ **चेतावनी संकेत:**\n• **अचानक तेज सिरदर्द**\n• **आपातकाल के लिए 108 पर कॉल करें**"
    },
    cough: {
      en: "**Cough Management** (Source: National Health Portal)\n\n**Natural Remedies:**\n• **Honey and ginger** tea (2-3 times daily)\n• **Steam inhalation** with eucalyptus\n• Warm salt water gargling\n• Stay hydrated, avoid cold foods\n\n**When to Consult Doctor:**\n• Cough persists for **2+ weeks**\n• **Blood in sputum**\n• High fever with cough\n• Difficulty breathing\n\n**COVID Protocol:** If dry cough with fever, get tested immediately",
      hi: "**खांसी प्रबंधन** (स्रोत: राष्ट्रीय स्वास्थ्य पोर्टल)\n\n**प्राकृतिक उपचार:**\n• **शहद और अदरक** की चाय\n• **भाप लेना** नीलगिरी के साथ\n• गर्म नमक पानी से गरारे\n• पानी पिएं, ठंडा खाना न लें\n\n**डॉक्टर से मिलें यदि:**\n• खांसी **2+ सप्ताह** से हो\n• **कफ में खून**\n• सांस लेने में तकलीफ\n\n**COVID प्रोटोकॉल:** सूखी खांसी और बुखार हो तो तुरंत जांच कराएं"
    },
    stomach: {
      en: "**Stomach Pain Relief** (Source: Ministry of Health)\n\n**Immediate Care:**\n• **Rest** and avoid solid food temporarily\n• **ORS solution** for hydration\n• **Ginger tea** for nausea\n• Apply **warm compress** on abdomen\n\n**Safe Medications:**\n• **Antacid** for acidity\n• **ORS** for dehydration\n\n⚠️ **Seek Immediate Help If:**\n• **Severe abdominal pain**\n• **Vomiting blood**\n• **High fever** with pain\n• **Call 108**",
      hi: "**पेट दर्द राहत** (स्रोत: स्वास्थ्य मंत्रालय)\n\n**तत्काल देखभाल:**\n• **आराम** करें, ठोस भोजन न लें\n• **ORS घोल** पिएं\n• **अदरक की चाय** मतली के लिए\n• पेट पर **गर्म सेक**\n\n**सुरक्षित दवाएं:**\n• **एंटासिड** एसिडिटी के लिए\n• **ORS** निर्जलीकरण के लिए\n\n⚠️ **तुरंत मदद लें यदि:**\n• **तेज पेट दर्द**\n• **खून की उल्टी**\n• **108 पर कॉल करें**"
    }
  };

  // Detect health conditions
  if (lowerMessage.includes('fever') || lowerMessage.includes('बुखार') || lowerMessage.includes('temperature')) {
    return {
      response: healthResponses.fever[language] || healthResponses.fever.en,
      confidence: 0.9,
      source: 'Health Database'
    };
  }
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('सिरदर्द') || lowerMessage.includes('head pain')) {
    return {
      response: healthResponses.headache[language] || healthResponses.headache.en,
      confidence: 0.9,
      source: 'Health Database'
    };
  }
  
  if (lowerMessage.includes('cough') || lowerMessage.includes('खांसी')) {
    return {
      response: healthResponses.cough[language] || healthResponses.cough.en,
      confidence: 0.9,
      source: 'Health Database'
    };
  }
  
  if (lowerMessage.includes('stomach') || lowerMessage.includes('पेट') || lowerMessage.includes('abdominal')) {
    return {
      response: healthResponses.stomach[language] || healthResponses.stomach.en,
      confidence: 0.9,
      source: 'Health Database'
    };
  }

  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('hey')) {
    const greetings = {
      en: "Hello! I'm YOGIC.ai, your health assistant. I can help you with:\n\n• **Health symptoms** and basic care\n• **Emergency guidance** (Call 108)\n• **Medication information**\n• **Vaccination details**\n\nWhat health question can I help you with today?",
      hi: "नमस्ते! मैं YOGIC.ai हूं, आपका स्वास्थ्य सहायक। मैं आपकी मदद कर सकता हूं:\n\n• **स्वास्थ्य लक्षण** और बुनियादी देखभाल\n• **आपातकालीन मार्गदर्शन** (108 पर कॉल करें)\n• **दवा की जानकारी**\n• **टीकाकरण विवरण**\n\nआज मैं आपके किस स्वास्थ्य प्रश्न में मदद कर सकता हूं?"
    };
    return {
      response: greetings[language] || greetings.en,
      confidence: 1.0,
      source: 'Greeting'
    };
  }

  // Default health guidance
  const defaultResponses = {
    en: "I understand you have a health concern. For proper medical advice, I recommend:\n\n• **Consult a healthcare professional** for accurate diagnosis\n• **Call 108** for medical emergencies\n• **Visit nearest hospital** for serious symptoms\n\nCan you describe your specific symptoms so I can provide better guidance?",
    hi: "मैं समझता हूं कि आपको स्वास्थ्य संबंधी चिंता है। उचित चिकित्सा सलाह के लिए:\n\n• **स्वास्थ्य पेशेवर से सलाह लें**\n• **आपातकाल के लिए 108 पर कॉल करें**\n• **गंभीर लक्षणों के लिए निकटतम अस्पताल जाएं**\n\nक्या आप अपने विशिष्ट लक्षणों का वर्णन कर सकते हैं?"
  };

  return {
    response: defaultResponses[language] || defaultResponses.en,
    confidence: 0.7,
    source: 'General Health Guidance'
  };
};

// Chat endpoint
router.post('/', verifyToken, async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;
    const userId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Chat request from user ${userId}: "${message}" (${language})`);

    // Get user's chat history for context
    const user = await User.findById(userId);
    const chatHistory = user ? user.chatHistory.slice(-3) : [];

    // Generate health response
    const aiResponse = await generateHealthResponse(message.trim(), language, chatHistory);

    console.log(`AI Response: ${aiResponse.response.substring(0, 100)}...`);

    // Save chat to user's history
    if (user) {
      user.chatHistory.push({
        message: message.trim(),
        response: aiResponse.response,
        timestamp: new Date(),
        language: language,
        confidence: aiResponse.confidence
      });
      
      // Keep only last 50 chats
      if (user.chatHistory.length > 50) {
        user.chatHistory = user.chatHistory.slice(-50);
      }
      
      await user.save();
    }

    res.json({
      response: aiResponse.response,
      confidence: aiResponse.confidence,
      source: aiResponse.source,
      responseLanguage: language,
      timestamp: new Date(),
      isEmergency: aiResponse.response.includes('🚨')
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: 'Sorry, I\'m having technical difficulties. For emergencies, please call **108**.'
    });
  }
});

// Get chat history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('chatHistory');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      chatHistory: user.chatHistory || []
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear chat history
router.delete('/history', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.chatHistory = [];
    await user.save();

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;