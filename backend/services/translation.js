const axios = require('axios');

// Translation service using AI4Bharat/Bhashini API
async function translateText(text, fromLang, toLang) {
  try {
    // Using AI4Bharat IndicTrans API (free tier)
    const response = await axios.post('https://api.ai4bharat.org/translate', {
      text: text,
      source_language: fromLang,
      target_language: toLang
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.AI4BHARAT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
    
    return response.data.translated_text || text;
    
  } catch (error) {
    console.error('Translation error:', error.message);
    
    // Fallback to basic translations for common phrases
    return getFallbackTranslation(text, fromLang, toLang);
  }
}

function getFallbackTranslation(text, fromLang, toLang) {
  const translations = {
    'hi': {
      'hello': 'नमस्ते',
      'fever': 'बुखार',
      'cough': 'खांसी',
      'headache': 'सिरदर्द',
      'doctor': 'डॉक्टर',
      'medicine': 'दवा',
      'hospital': 'अस्पताल',
      'vaccine': 'टीका',
      'health': 'स्वास्थ्य',
      'symptoms': 'लक्षण'
    },
    'te': {
      'hello': 'నమస్కారం',
      'fever': 'జ్వరం',
      'cough': 'దగ్గు',
      'doctor': 'వైద్యుడు'
    },
    'ta': {
      'hello': 'வணக்கம்',
      'fever': 'காய்ச்சல்',
      'cough': 'இருமல்',
      'doctor': 'மருத்துவர்'
    }
  };
  
  if (toLang === 'en') {
    // Reverse lookup for Indian languages to English
    for (const [lang, words] of Object.entries(translations)) {
      for (const [eng, local] of Object.entries(words)) {
        if (text.includes(local)) {
          return text.replace(local, eng);
        }
      }
    }
  } else if (translations[toLang]) {
    // English to Indian language
    for (const [eng, local] of Object.entries(translations[toLang])) {
      if (text.toLowerCase().includes(eng)) {
        return text.toLowerCase().replace(eng, local);
      }
    }
  }
  
  return text; // Return original if no translation found
}

// Language detection
function detectLanguage(text) {
  const patterns = {
    'hi': /[\u0900-\u097F]/,  // Devanagari
    'te': /[\u0C00-\u0C7F]/,  // Telugu
    'ta': /[\u0B80-\u0BFF]/,  // Tamil
    'bn': /[\u0980-\u09FF]/,  // Bengali
    'gu': /[\u0A80-\u0AFF]/,  // Gujarati
    'kn': /[\u0C80-\u0CFF]/,  // Kannada
    'ml': /[\u0D00-\u0D7F]/,  // Malayalam
    'or': /[\u0B00-\u0B7F]/,  // Odia
    'pa': /[\u0A00-\u0A7F]/,  // Punjabi
    'ur': /[\u0600-\u06FF]/   // Urdu
  };
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) {
      return lang;
    }
  }
  
  return 'en'; // Default to English
}

module.exports = {
  translateText,
  detectLanguage
};