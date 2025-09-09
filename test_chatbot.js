// Simple test for chatbot
const axios = require('axios');

async function testChatbot() {
  try {
    console.log('Testing chatbot...');
    
    // Test backend health
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Backend health:', healthResponse.data);
    
    // Test chat endpoint
    const chatResponse = await axios.post('http://localhost:3000/api/chat', {
      message: 'मुझे बुखार है',
      userId: 'test123',
      language: 'hi'
    });
    
    console.log('✅ Chat response:', chatResponse.data);
    
    // Test English message
    const englishResponse = await axios.post('http://localhost:3000/api/chat', {
      message: 'I have fever',
      userId: 'test123', 
      language: 'en'
    });
    
    console.log('✅ English response:', englishResponse.data);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testChatbot();