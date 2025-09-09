// Simple test without fetch
console.log('🔍 Testing Gemini API Key...');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND');

if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('Dummy')) {
  console.log('✅ API Key looks valid');
} else {
  console.log('❌ API Key is missing or invalid');
}