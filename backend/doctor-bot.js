const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('👨‍⚕️ AI Doctor Bot started...');

// Professional Medical AI Response
async function getDoctorResponse(message) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  const doctorPrompt = `You are Dr. AI - a highly skilled, experienced medical doctor with access to all global medical knowledge and real-time health data. You have:

🩺 MEDICAL EXPERTISE:
- 20+ years of clinical experience across all specialties
- Access to latest medical research, WHO guidelines, CDC data
- Knowledge of Indian healthcare system, MoHFW protocols
- Expertise in tropical diseases, infectious diseases, chronic conditions
- Updated with latest treatment protocols and drug information

📊 REAL-TIME MEDICAL DATA ACCESS:
- Current disease outbreaks and epidemiology
- Latest treatment guidelines and clinical studies
- Drug interactions, dosages, and contraindications
- Diagnostic criteria and differential diagnosis
- Emergency protocols and critical care guidelines

💬 COMMUNICATION STYLE:
- Professional yet compassionate medical consultation
- Provide detailed, evidence-based medical advice
- Include symptoms, causes, treatments, and prevention
- Always mention when to seek immediate medical attention
- Use proper medical terminology with clear explanations

🚨 SAFETY PROTOCOLS:
- Always recommend consulting local doctors for serious conditions
- Provide emergency numbers: 108 (Emergency), 104 (Health Helpline)
- Never replace professional medical examination
- Emphasize the importance of proper diagnosis

Patient Query: "${message}"

Provide a comprehensive medical consultation response as Dr. AI:`;

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: doctorPrompt }] }],
      generationConfig: { 
        temperature: 0.3, 
        maxOutputTokens: 1500,
        topK: 40,
        topP: 0.95
      }
    });

    if (response.data.candidates && response.data.candidates[0]) {
      return response.data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response');
  } catch (error) {
    console.error('AI Error:', error.message);
    return `🩺 **Dr. AI - Medical Consultation**

I'm experiencing a technical issue accessing my medical database. However, I can provide basic guidance:

For immediate medical concerns:
🚨 **Emergency**: Call 108
🏥 **Health Helpline**: Call 104
🩺 **Consult local doctor** for proper examination

Please describe your symptoms in detail, and I'll do my best to help with the available information.`;
  }
}

// Handle messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;
  const userName = msg.from.first_name || 'Patient';
  
  console.log(`👨‍⚕️ Consultation with ${userName}: ${userMessage}`);
  
  try {
    // Get professional medical response
    const doctorResponse = await getDoctorResponse(userMessage);
    console.log(`🩺 Dr. AI Response: ${doctorResponse.substring(0, 100)}...`);
    
    // Send response
    await bot.sendMessage(chatId, doctorResponse, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('Bot Error:', error.message);
    await bot.sendMessage(chatId, '🩺 Dr. AI is temporarily unavailable. For emergencies, call 108 immediately.');
  }
});

// Welcome message
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `👨‍⚕️ **Welcome to Dr. AI - Your Personal Medical Consultant**

🩺 I'm an AI doctor with comprehensive medical knowledge and access to real-time health data. I can help you with:

📋 **Medical Consultations:**
• Symptom analysis and differential diagnosis
• Disease information and treatment options
• Medication guidance and drug interactions
• Preventive care and health maintenance
• Emergency protocols and when to seek help

🌍 **Specialized Knowledge:**
• Indian healthcare system and MoHFW guidelines
• Tropical and infectious diseases
• Chronic condition management
• Latest medical research and treatment protocols

⚠️ **Important Disclaimer:**
While I provide evidence-based medical information, I cannot replace physical examination by a qualified doctor. Always consult healthcare professionals for serious conditions.

🚨 **Emergency Numbers:**
• Emergency: 108
• Health Helpline: 104

How can I assist you with your health concerns today?`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

console.log('✅ Dr. AI is ready for consultations!');