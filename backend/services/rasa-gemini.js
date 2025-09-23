const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

class RasaGeminiService {
  constructor() {
    this.rasaUrl = process.env.RASA_URL || 'http://localhost:5005';
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async processMessage(message, userId = 'user') {
    try {
      // Step 1: Send to Rasa for intent/entity extraction
      const rasaResponse = await this.sendToRasa(message, userId);
      
      // Step 2: Check if Rasa has a confident response
      if (this.hasConfidentRasaResponse(rasaResponse)) {
        return {
          source: 'rasa',
          response: rasaResponse.text,
          intent: rasaResponse.intent,
          entities: rasaResponse.entities,
          confidence: rasaResponse.confidence
        };
      }
      
      // Step 3: Use Gemini for complex queries with Rasa context
      const geminiResponse = await this.sendToGemini(message, rasaResponse);
      
      return {
        source: 'gemini',
        response: geminiResponse,
        intent: rasaResponse.intent,
        entities: rasaResponse.entities,
        confidence: rasaResponse.confidence
      };
      
    } catch (error) {
      console.error('Rasa-Gemini processing error:', error);
      return {
        source: 'fallback',
        response: 'मुझे खुशी होगी अगर आप अपना सवाल दोबारा पूछें। / I would be happy if you ask your question again.',
        intent: null,
        entities: [],
        confidence: 0
      };
    }
  }

  async sendToRasa(message, userId) {
    try {
      const response = await axios.post(`${this.rasaUrl}/webhooks/rest/webhook`, {
        sender: userId,
        message: message
      }, { timeout: 5000 });

      if (response.data && response.data.length > 0) {
        return {
          text: response.data[0].text,
          intent: response.data[0].intent || null,
          entities: response.data[0].entities || [],
          confidence: response.data[0].confidence || 0
        };
      }
      
      return { text: null, intent: null, entities: [], confidence: 0 };
    } catch (error) {
      console.log('Rasa not available, using Gemini only');
      return { text: null, intent: null, entities: [], confidence: 0 };
    }
  }

  hasConfidentRasaResponse(rasaResponse) {
    return rasaResponse.text && 
           rasaResponse.confidence > 0.7 && 
           !rasaResponse.text.includes('समझने में कठिनाई') &&
           !rasaResponse.text.includes('trouble understanding');
  }

  async sendToGemini(message, rasaContext) {
    const prompt = this.buildGeminiPrompt(message, rasaContext);
    
    try {
      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  buildGeminiPrompt(message, rasaContext) {
    let prompt = `You are a multilingual health assistant for rural India. 

Context from Rasa NLP:
- Intent: ${rasaContext.intent || 'unknown'}
- Entities: ${JSON.stringify(rasaContext.entities || [])}
- Confidence: ${rasaContext.confidence || 0}

User Message: "${message}"

Instructions:
1. Respond in the same language as the user
2. Provide medical advice suitable for rural areas
3. Include emergency numbers (108) when needed
4. Keep responses under 200 words
5. Be empathetic and culturally sensitive

Response:`;

    return prompt;
  }
}

module.exports = RasaGeminiService;