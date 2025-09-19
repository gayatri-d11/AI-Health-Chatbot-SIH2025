// Advanced n8n Automation Features for Health Bot

// 1. SCHEDULED HEALTH REMINDERS
const healthReminders = {
  // Daily medication reminders
  medicationReminder: {
    schedule: "0 8,20 * * *", // 8 AM and 8 PM daily
    message: "🕐 Medication Reminder\n\nTime for your prescribed medicines!\n\nReply 'TAKEN' when completed.\n\n- Dr. AI HealthBot"
  },
  
  // Weekly health checkup
  weeklyCheckup: {
    schedule: "0 10 * * 1", // Every Monday 10 AM
    message: "📊 Weekly Health Check\n\nHow are you feeling this week?\n\n1️⃣ Excellent\n2️⃣ Good\n3️⃣ Fair\n4️⃣ Poor\n\nReply with number.\n\n- Dr. AI HealthBot"
  }
};

// 2. EMERGENCY DETECTION & AUTO-RESPONSE
const emergencyKeywords = {
  hindi: ['दिल का दौरा', 'सांस नहीं आ रही', 'बेहोश', 'खून', 'दुर्घटना'],
  english: ['heart attack', 'cant breathe', 'unconscious', 'bleeding', 'accident'],
  telugu: ['గుండెపోటు', 'ఊపిరి రాదు', 'అపస్మారక', 'రక్తం', 'ప్రమాదం']
};

const emergencyResponse = `🚨 MEDICAL EMERGENCY DETECTED 🚨

IMMEDIATE ACTIONS:
1️⃣ Call 108 NOW
2️⃣ Stay calm, help is coming
3️⃣ Share your location

📞 Emergency Numbers:
• National: 108
• Police: 100
• Fire: 101

🏥 Nearest Hospital: [Auto-detected]

- Dr. AI Emergency Response`;

// 3. HEALTH DATA COLLECTION & ANALYSIS
const healthDataCollection = {
  // Collect vital signs
  collectVitals: {
    trigger: "vitals",
    questions: [
      "What's your current body temperature? (in °F)",
      "What's your blood pressure? (e.g., 120/80)",
      "What's your heart rate? (beats per minute)",
      "Any symptoms today? (fever, headache, etc.)"
    ]
  },
  
  // BMI calculation
  calculateBMI: {
    trigger: "bmi",
    formula: "weight(kg) / (height(m))²",
    response: "Your BMI is {result}. This is considered {category}."
  }
};

// 4. MULTI-LANGUAGE AUTO-TRANSLATION
const languageDetection = {
  detectAndRespond: function(message) {
    const patterns = {
      hindi: /[\u0900-\u097F]/,
      telugu: /[\u0C00-\u0C7F]/,
      tamil: /[\u0B80-\u0BFF]/,
      bengali: /[\u0980-\u09FF]/,
      gujarati: /[\u0A80-\u0AFF]/
    };
    
    for (let [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(message)) {
        return lang;
      }
    }
    return 'english';
  }
};

// 5. APPOINTMENT BOOKING AUTOMATION
const appointmentBooking = {
  bookAppointment: {
    trigger: "book appointment",
    flow: [
      "🏥 Appointment Booking\n\nSelect department:\n1️⃣ General Medicine\n2️⃣ Cardiology\n3️⃣ Pediatrics\n4️⃣ Gynecology",
      "📅 Available dates:\n1️⃣ Tomorrow\n2️⃣ Day after tomorrow\n3️⃣ This weekend",
      "⏰ Available times:\n1️⃣ 9:00 AM\n2️⃣ 11:00 AM\n3️⃣ 2:00 PM\n4️⃣ 4:00 PM",
      "✅ Appointment confirmed!\n\nDetails:\nDate: {date}\nTime: {time}\nDoctor: {doctor}\nLocation: {hospital}\n\nReminder will be sent 1 hour before."
    ]
  }
};

// 6. HEALTH EDUCATION CAMPAIGNS
const healthEducation = {
  campaigns: {
    diabetes: {
      schedule: "0 9 1 * *", // 1st of every month
      content: "🍎 Diabetes Prevention Month\n\nTips:\n• Eat balanced meals\n• Exercise 30 min daily\n• Monitor blood sugar\n• Stay hydrated\n\nNeed diabetes consultation? Reply 'DIABETES'"
    },
    
    hypertension: {
      schedule: "0 9 15 * *", // 15th of every month
      content: "❤️ Heart Health Awareness\n\nReduce blood pressure:\n• Less salt intake\n• Regular exercise\n• Stress management\n• Adequate sleep\n\nCheck BP? Reply 'BP CHECK'"
    }
  }
};

// 7. INTEGRATION WITH EXISTING BACKEND
const backendIntegration = {
  // Log conversation to your existing API
  logToBackend: async function(data) {
    const response = await fetch('http://localhost:5000/api/chat/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: data.from,
        message: data.message,
        response: data.aiResponse,
        channel: 'whatsapp',
        language: data.detectedLanguage,
        timestamp: new Date().toISOString()
      })
    });
    return response.json();
  },
  
  // Get user health history
  getUserHistory: async function(phoneNumber) {
    const response = await fetch(`http://localhost:5000/api/users/history/${phoneNumber}`);
    return response.json();
  }
};

// 8. WEBHOOK SECURITY
const webhookSecurity = {
  verifyWebhook: function(signature, body, secret) {
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }
};

module.exports = {
  healthReminders,
  emergencyKeywords,
  emergencyResponse,
  healthDataCollection,
  languageDetection,
  appointmentBooking,
  healthEducation,
  backendIntegration,
  webhookSecurity
};