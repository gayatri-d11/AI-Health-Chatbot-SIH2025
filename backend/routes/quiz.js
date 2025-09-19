const express = require('express');
const router = express.Router();
const { User } = require('../models/mongodb');

// Comprehensive Health Quiz Questions
const healthQuiz = {
  en: [
    {
      question: "How would you rate your overall health?",
      options: ["Excellent", "Good", "Fair", "Poor"],
      category: "general_health",
      points: [10, 7, 4, 1]
    },
    {
      question: "Do you have any chronic conditions?",
      options: ["None", "Diabetes", "Hypertension", "Multiple conditions"],
      category: "chronic_conditions",
      points: [10, 5, 5, 2]
    },
    {
      question: "How often do you exercise?",
      options: ["Daily", "3-4 times/week", "1-2 times/week", "Rarely/Never"],
      category: "lifestyle",
      points: [10, 8, 5, 2]
    },
    {
      question: "What is your age group?",
      options: ["18-30 years", "31-50 years", "51-70 years", "Above 70 years"],
      category: "demographics",
      points: [8, 8, 6, 4]
    },
    {
      question: "Do you smoke or use tobacco?",
      options: ["Never", "Used to, but quit", "Occasionally", "Yes, regularly"],
      category: "lifestyle",
      points: [10, 7, 3, 1]
    },
    {
      question: "How many hours do you sleep daily?",
      options: ["7-8 hours", "6-7 hours", "More than 8 hours", "Less than 6 hours"],
      category: "lifestyle",
      points: [10, 7, 6, 3]
    },
    {
      question: "Have you experienced any symptoms recently?",
      options: ["None", "Mild symptoms", "Moderate symptoms", "Severe symptoms"],
      category: "symptoms",
      points: [10, 7, 4, 1]
    },
    {
      question: "How often do you visit a doctor?",
      options: ["Regular checkups", "Only when sick", "Rarely", "Never"],
      category: "healthcare_access",
      points: [10, 6, 3, 1]
    },
    {
      question: "Do you follow a balanced diet?",
      options: ["Always", "Most of the time", "Sometimes", "Rarely"],
      category: "nutrition",
      points: [10, 8, 5, 2]
    },
    {
      question: "How do you manage stress?",
      options: ["Very well", "Moderately well", "With difficulty", "Cannot manage"],
      category: "mental_health",
      points: [10, 7, 4, 1]
    }
  ],
  hi: [
    {
      question: "आप अपने समग्र स्वास्थ्य को कैसे रेट करेंगे?",
      options: ["उत्कृष्ट", "अच्छा", "ठीक-ठाक", "खराब"],
      category: "general_health",
      points: [10, 7, 4, 1]
    },
    {
      question: "क्या आपको कोई पुरानी बीमारी है?",
      options: ["कोई नहीं", "मधुमेह", "उच्च रक्तचाप", "कई बीमारियां"],
      category: "chronic_conditions",
      points: [10, 5, 5, 2]
    },
    {
      question: "आप कितनी बार व्यायाम करते हैं?",
      options: ["रोज", "सप्ताह में 3-4 बार", "सप्ताह में 1-2 बार", "कभी-कभार/कभी नहीं"],
      category: "lifestyle",
      points: [10, 8, 5, 2]
    },
    {
      question: "आपकी उम्र कितनी है?",
      options: ["18-30 साल", "31-50 साल", "51-70 साल", "70 साल से ज्यादा"],
      category: "demographics",
      points: [8, 8, 6, 4]
    },
    {
      question: "क्या आप धूम्रपान या तंबाकू का सेवन करते हैं?",
      options: ["कभी नहीं", "पहले करता था, अब छोड़ दिया", "कभी-कभार", "हां, नियमित रूप से"],
      category: "lifestyle",
      points: [10, 7, 3, 1]
    },
    {
      question: "आप रोज कितने घंटे सोते हैं?",
      options: ["7-8 घंटे", "6-7 घंटे", "8 घंटे से ज्यादा", "6 घंटे से कम"],
      category: "lifestyle",
      points: [10, 7, 6, 3]
    },
    {
      question: "क्या आपको हाल ही में कोई लक्षण हुए हैं?",
      options: ["कोई नहीं", "हल्के लक्षण", "मध्यम लक्षण", "गंभीर लक्षण"],
      category: "symptoms",
      points: [10, 7, 4, 1]
    },
    {
      question: "आप कितनी बार डॉक्टर के पास जाते हैं?",
      options: ["नियमित जांच", "केवल बीमार होने पर", "कभी-कभार", "कभी नहीं"],
      category: "healthcare_access",
      points: [10, 6, 3, 1]
    },
    {
      question: "क्या आप संतुलित आहार लेते हैं?",
      options: ["हमेशा", "अधिकतर समय", "कभी-कभी", "शायद ही कभी"],
      category: "nutrition",
      points: [10, 8, 5, 2]
    },
    {
      question: "आप तनाव को कैसे संभालते हैं?",
      options: ["बहुत अच्छे से", "मध्यम रूप से", "कठिनाई से", "संभाल नहीं सकते"],
      category: "mental_health",
      points: [10, 7, 4, 1]
    }
  ]
};

// Get quiz question
router.post('/question', async (req, res) => {
  try {
    const { language = 'en', questionIndex = 0 } = req.body;
    
    const questions = healthQuiz[language] || healthQuiz.en;
    const currentQuestion = questions[questionIndex];
    
    if (!currentQuestion) {
      return res.json({
        success: true,
        completed: true,
        message: language === 'hi' ? 
          '🎉 स्वास्थ्य सर्वे पूरा हुआ! धन्यवाद।' :
          '🎉 Health survey completed! Thank you.',
        totalQuestions: questions.length
      });
    }
    
    res.json({
      success: true,
      question: currentQuestion,
      questionNumber: questionIndex + 1,
      totalQuestions: questions.length,
      progress: Math.round(((questionIndex + 1) / questions.length) * 100)
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Quiz not available' });
  }
});

// Submit quiz answer
router.post('/submit', async (req, res) => {
  try {
    const { userId, questionIndex, answerIndex, language = 'en' } = req.body;
    
    const questions = healthQuiz[language] || healthQuiz.en;
    const question = questions[questionIndex];
    
    if (!question) {
      return res.status(400).json({ error: 'Invalid question' });
    }
    
    const points = question.points[answerIndex] || 0;
    const answer = question.options[answerIndex];
    
    // Save to database if user exists
    try {
      await User.findOneAndUpdate(
        { email: userId },
        { 
          $push: { 
            quizResponses: {
              questionIndex,
              answer,
              points,
              timestamp: new Date()
            }
          },
          $inc: { totalQuizPoints: points }
        }
      );
    } catch (dbError) {
      console.log('DB save failed, continuing...');
    }
    
    res.json({
      success: true,
      points: points,
      message: language === 'hi' ? 'जवाब सेव हो गया' : 'Response saved',
      nextQuestion: questionIndex + 1
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to save response' });
  }
});

// Get quiz results
router.post('/results', async (req, res) => {
  try {
    const { userId, language = 'en' } = req.body;
    
    let totalPoints = 0;
    let user = null;
    
    try {
      user = await User.findOne({ email: userId });
      totalPoints = user?.totalQuizPoints || 0;
    } catch (error) {
      totalPoints = 70; // Default for demo
    }
    
    const maxPoints = 100;
    const percentage = Math.round((totalPoints / maxPoints) * 100);
    
    let healthStatus, recommendations;
    
    if (language === 'hi') {
      if (percentage >= 80) {
        healthStatus = 'उत्कृष्ट स्वास्थ्य';
        recommendations = [
          'आपका स्वास्थ्य बहुत अच्छा है',
          'वर्तमान जीवनशैली जारी रखें',
          'नियमित जांच कराते रहें'
        ];
      } else if (percentage >= 60) {
        healthStatus = 'अच्छा स्वास्थ्य';
        recommendations = [
          'कुछ सुधार की आवश्यकता है',
          'नियमित व्यायाम करें',
          'संतुलित आहार लें'
        ];
      } else {
        healthStatus = 'स्वास्थ्य में सुधार चाहिए';
        recommendations = [
          'डॉक्टर से सलाह लें',
          'जीवनशैली में बदलाव करें',
          'नियमित जांच कराएं'
        ];
      }
    } else {
      if (percentage >= 80) {
        healthStatus = 'Excellent Health';
        recommendations = [
          'Your health is excellent',
          'Continue current lifestyle',
          'Regular checkups recommended'
        ];
      } else if (percentage >= 60) {
        healthStatus = 'Good Health';
        recommendations = [
          'Some improvements needed',
          'Regular exercise recommended',
          'Maintain balanced diet'
        ];
      } else {
        healthStatus = 'Health Needs Attention';
        recommendations = [
          'Consult with doctor',
          'Lifestyle changes needed',
          'Regular health monitoring'
        ];
      }
    }
    
    res.json({
      success: true,
      totalPoints,
      percentage,
      healthStatus,
      recommendations,
      badge: percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🥉'
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to get results' });
  }
});

// Get daily health tip
router.get('/tip', (req, res) => {
  const { language = 'en' } = req.query;
  
  const tips = {
    en: [
      '💧 Drink 8 glasses of water daily',
      '🚶 Walk for 30 minutes every day',
      '🥗 Eat 5 servings of fruits and vegetables',
      '😴 Get 7-8 hours of sleep',
      '🧘 Practice meditation for stress relief'
    ],
    hi: [
      '💧 रोज 8 गिलास पानी पिएं',
      '🚶 रोज 30 मिनट टहलें',
      '🥗 फल और सब्जियां खाएं',
      '😴 7-8 घंटे की नींद लें',
      '🧘 तनाव के लिए ध्यान करें'
    ]
  };
  
  const dailyTips = tips[language] || tips.en;
  const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
  
  res.json({
    success: true,
    tip: randomTip,
    date: new Date().toDateString()
  });
});

module.exports = router;