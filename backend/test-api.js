const fetch = require('node-fetch');
require('dotenv').config();

async function testGeminiAPI() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  console.log('🔍 Testing Gemini API Key...');
  console.log('API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('Dummy')) {
    console.log('❌ API Key not set properly in .env file');
    console.log('Please update GEMINI_API_KEY in your .env file with a real key');
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Hello, this is a test message. Please respond with 'API is working!'"
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (response.ok && data.candidates && data.candidates[0]) {
      console.log('✅ API Key is WORKING!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
    } else {
      console.log('❌ API Key is NOT working');
      console.log('Error:', data.error || data);
    }
    
  } catch (error) {
    console.log('❌ Network/Connection Error:', error.message);
  }
}

testGeminiAPI();