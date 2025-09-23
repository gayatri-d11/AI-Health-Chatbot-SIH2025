import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const HealthQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showResults, setShowResults] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = {
    'en': 'English',
    'hi': 'Hindi (हिंदी)'
  };

  const quizQuestions = {
    en: [
      {
        id: 1,
        question: "How would you rate your overall health?",
        options: ["Excellent", "Good", "Fair", "Poor"],
        type: "single",
        category: "general_health",
        points: [4, 3, 2, 1]
      },
      {
        id: 2,
        question: "Do you have any chronic conditions?",
        options: ["Diabetes", "Hypertension", "Heart Disease", "None"],
        type: "multiple",
        category: "chronic_conditions",
        points: [1, 1, 1, 4]
      },
      {
        id: 3,
        question: "How often do you exercise?",
        options: ["Daily", "3-4 times/week", "1-2 times/week", "Rarely/Never"],
        type: "single",
        category: "lifestyle",
        points: [4, 3, 2, 1]
      },
      {
        id: 4,
        question: "What is your age group?",
        options: ["18-30 years", "31-50 years", "51-70 years", "Above 70 years"],
        type: "single",
        category: "demographics",
        points: [4, 3, 2, 1]
      },
      {
        id: 5,
        question: "Do you smoke or use tobacco?",
        options: ["Yes, regularly", "Occasionally", "Used to, but quit", "Never"],
        type: "single",
        category: "lifestyle",
        points: [1, 2, 3, 4]
      },
      {
        id: 6,
        question: "How many hours do you sleep daily?",
        options: ["Less than 6 hours", "6-7 hours", "7-8 hours", "More than 8 hours"],
        type: "single",
        category: "lifestyle",
        points: [1, 2, 4, 3]
      },
      {
        id: 7,
        question: "Have you experienced any of these symptoms recently?",
        options: ["Fever/Headache", "Cough/Cold", "Stomach issues", "None"],
        type: "multiple",
        category: "symptoms",
        points: [1, 1, 1, 4]
      },
      {
        id: 8,
        question: "How often do you visit a doctor?",
        options: ["Regular checkups", "Only when sick", "Rarely", "Never"],
        type: "single",
        category: "healthcare_access",
        points: [4, 3, 2, 1]
      },
      {
        id: 9,
        question: "What's your stress level?",
        options: ["Very High", "High", "Moderate", "Low"],
        type: "single",
        category: "mental_health",
        points: [1, 2, 3, 4]
      },
      {
        id: 10,
        question: "Do you follow a balanced diet?",
        options: ["Always", "Most of the time", "Sometimes", "Rarely"],
        type: "single",
        category: "nutrition",
        points: [4, 3, 2, 1]
      }
    ],
    hi: [
      {
        id: 1,
        question: "आप अपने समग्र स्वास्थ्य को कैसे रेट करेंगे?",
        options: ["उत्कृष्ट", "अच्छा", "ठीक-ठाक", "खराब"],
        type: "single",
        category: "general_health",
        points: [4, 3, 2, 1]
      },
      {
        id: 2,
        question: "क्या आपको कोई पुरानी बीमारी है?",
        options: ["मधुमेह", "उच्च रक्तचाप", "हृदय रोग", "कोई नहीं"],
        type: "multiple",
        category: "chronic_conditions",
        points: [1, 1, 1, 4]
      },
      {
        id: 3,
        question: "आप कितनी बार व्यायाम करते हैं?",
        options: ["रोज", "सप्ताह में 3-4 बार", "सप्ताह में 1-2 बार", "कभी-कभार/कभी नहीं"],
        type: "single",
        category: "lifestyle",
        points: [4, 3, 2, 1]
      },
      {
        id: 4,
        question: "आपकी उम्र कितनी है?",
        options: ["18-30 साल", "31-50 साल", "51-70 साल", "70 साल से ज्यादा"],
        type: "single",
        category: "demographics",
        points: [4, 3, 2, 1]
      },
      {
        id: 5,
        question: "क्या आप धूम्रपान या तंबाकू का सेवन करते हैं?",
        options: ["हां, नियमित रूप से", "कभी-कभार", "पहले करता था, अब छोड़ दिया", "कभी नहीं"],
        type: "single",
        category: "lifestyle",
        points: [1, 2, 3, 4]
      },
      {
        id: 6,
        question: "आप रोज कितने घंटे सोते हैं?",
        options: ["6 घंटे से कम", "6-7 घंटे", "7-8 घंटे", "8 घंटे से ज्यादा"],
        type: "single",
        category: "lifestyle",
        points: [1, 2, 4, 3]
      },
      {
        id: 7,
        question: "क्या आपको हाल ही में ये लक्षण हुए हैं?",
        options: ["बुखार/सिरदर्द", "खांसी/जुकाम", "पेट की समस्या", "कोई नहीं"],
        type: "multiple",
        category: "symptoms",
        points: [1, 1, 1, 4]
      },
      {
        id: 8,
        question: "आप कितनी बार डॉक्टर के पास जाते हैं?",
        options: ["नियमित जांच", "केवल बीमार होने पर", "कभी-कभार", "कभी नहीं"],
        type: "single",
        category: "healthcare_access",
        points: [4, 3, 2, 1]
      },
      {
        id: 9,
        question: "आपका तनाव का स्तर क्या है?",
        options: ["बहुत ज्यादा", "ज्यादा", "मध्यम", "कम"],
        type: "single",
        category: "mental_health",
        points: [1, 2, 3, 4]
      },
      {
        id: 10,
        question: "क्या आप संतुलित आहार लेते हैं?",
        options: ["हमेशा", "ज्यादातर समय", "कभी-कभी", "कभी-कभार"],
        type: "single",
        category: "nutrition",
        points: [4, 3, 2, 1]
      }
    ]
  };

  const questions = quizQuestions[selectedLanguage] || quizQuestions.en;

  const handleAnswerSelect = (questionId, optionIndex, isMultiple = false) => {
    if (isMultiple) {
      const currentAnswers = answers[questionId] || [];
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(idx => idx !== optionIndex)
        : [...currentAnswers, optionIndex];
      
      setAnswers({
        ...answers,
        [questionId]: newAnswers
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: [optionIndex]
      });
    }
  };

  const nextQuestion = async () => {
    setIsTransitioning(true);
    
    // Submit current answer to backend
    const userAnswers = answers[currentQ.id] || [];
    for (const answerIndex of userAnswers) {
      try {
        await fetch('http://localhost:3000/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser?.email || 'demo@user.com',
            questionIndex: currentQuestion,
            answerIndex: answerIndex,
            language: selectedLanguage
          })
        });
      } catch (error) {
        console.log('Failed to submit answer:', error);
      }
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        completeQuiz();
      }
      setIsTransitioning(false);
    }, 150);
  };

  const prevQuestion = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion > 0) {
        setCurrentQuestion(currentQuestion - 1);
      }
      setIsTransitioning(false);
    }, 150);
  };

  const completeQuiz = async () => {
    try {
      // Get results from backend
      const response = await fetch('http://localhost:3000/api/quiz/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.email || 'demo@user.com',
          language: selectedLanguage
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setScore(data.percentage);
      } else {
        // Fallback calculation
        let totalScore = 0;
        let maxScore = 0;

        questions.forEach(question => {
          const userAnswers = answers[question.id] || [];
          const questionScore = userAnswers.reduce((sum, answerIndex) => {
            return sum + (question.points[answerIndex] || 0);
          }, 0);
          
          totalScore += questionScore;
          maxScore += Math.max(...question.points);
        });

        setScore(Math.round((totalScore / maxScore) * 100));
      }
    } catch (error) {
      console.log('Failed to get results, using fallback');
      // Fallback calculation
      let totalScore = 0;
      let maxScore = 0;

      questions.forEach(question => {
        const userAnswers = answers[question.id] || [];
        const questionScore = userAnswers.reduce((sum, answerIndex) => {
          return sum + (question.points[answerIndex] || 0);
        }, 0);
        
        totalScore += questionScore;
        maxScore += Math.max(...question.points);
      });

      setScore(Math.round((totalScore / maxScore) * 100));
    }
    
    setQuizCompleted(true);
    setShowResults(true);
  };

  const getHealthRecommendations = () => {
    const recommendations = {
      en: {
        excellent: {
          title: "Excellent Health Status",
          message: "You're maintaining excellent health habits. Keep up the great work!",
          tips: [
            "Continue regular exercise routine",
            "Maintain balanced diet",
            "Keep up with regular health checkups",
            "Stay hydrated and get adequate sleep"
          ]
        },
        good: {
          title: "Good Health Status",
          message: "You're on the right track! A few improvements can enhance your wellbeing.",
          tips: [
            "Increase physical activity if possible",
            "Focus on stress management techniques",
            "Ensure 7-8 hours of sleep daily",
            "Consider regular health screenings"
          ]
        },
        fair: {
          title: "Fair Health Status",
          message: "There's room for improvement. Consider making some lifestyle changes.",
          tips: [
            "Start with 30 minutes of daily exercise",
            "Improve diet with more fruits and vegetables",
            "Quit smoking/tobacco if applicable",
            "Schedule a health checkup soon"
          ]
        },
        poor: {
          title: "Health Needs Attention",
          message: "Your health requires immediate attention. Please consult a healthcare provider.",
          tips: [
            "Schedule an immediate doctor consultation",
            "Start with basic lifestyle changes",
            "Consider professional health guidance",
            "Monitor symptoms closely"
          ]
        }
      },
      hi: {
        excellent: {
          title: "उत्कृष्ट स्वास्थ्य स्थिति",
          message: "आप उत्कृष्ट स्वास्थ्य आदतें बनाए रख रहे हैं। इसी तरह जारी रखें!",
          tips: [
            "नियमित व्यायाम जारी रखें",
            "संतुलित आहार बनाए रखें",
            "नियमित स्वास्थ्य जांच कराते रहें",
            "पर्याप्त पानी पिएं और अच्छी नींद लें"
          ]
        },
        good: {
          title: "अच्छी स्वास्थ्य स्थिति",
          message: "आप सही रास्ते पर हैं! कुछ सुधार आपकी भलाई बढ़ा सकते हैं।",
          tips: [
            "यदि संभव हो तो शारीरिक गतिविधि बढ़ाएं",
            "तनाव प्रबंधन तकनीकों पर ध्यान दें",
            "रोज 7-8 घंटे की नींद सुनिश्चित करें",
            "नियमित स्वास्थ्य जांच कराएं"
          ]
        },
        fair: {
          title: "ठीक-ठाक स्वास्थ्य स्थिति",
          message: "सुधार की गुंजाइश है। कुछ जीवनशैली में बदलाव करने पर विचार करें।",
          tips: [
            "रोज 30 मिनट व्यायाम से शुरुआत करें",
            "अधिक फल और सब्जियों के साथ आहार सुधारें",
            "धूम्रपान/तंबाकू छोड़ें यदि लागू हो",
            "जल्द स्वास्थ्य जांच कराएं"
          ]
        },
        poor: {
          title: "स्वास्थ्य पर ध्यान दें",
          message: "आपके स्वास्थ्य पर तुरंत ध्यान देने की जरूरत है। कृपया डॉक्टर से सलाह लें।",
          tips: [
            "तुरंत डॉक्टर से सलाह लें",
            "बुनियादी जीवनशैली में बदलाव शुरू करें",
            "पेशेवर स्वास्थ्य मार्गदर्शन लें",
            "लक्षणों पर बारीकी से नजर रखें"
          ]
        }
      }
    };

    const lang = recommendations[selectedLanguage] || recommendations.en;
    
    if (score >= 80) return lang.excellent;
    if (score >= 60) return lang.good;
    if (score >= 40) return lang.fair;
    return lang.poor;
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const recommendation = getHealthRecommendations();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-blue-50/30 py-12 px-4 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 animate-fadeIn">
            <div className="text-center mb-8 animate-fadeIn">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                  <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {/* Celebration particles */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                </div>
                <div className="absolute top-4 right-1/3 transform translate-x-1/2">
                  <div className="w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="absolute top-4 left-1/3 transform -translate-x-1/2">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedLanguage === 'hi' ? '🎉 मूल्यांकन पूर्ण!' : '🎉 Assessment Complete!'}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {selectedLanguage === 'hi' ? 'आपका स्वास्थ्य स्कोर:' : 'Your Health Score:'}
              </p>
              
              {/* Animated Score Circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="url(#gradient)" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                    className="transition-all duration-2000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-teal-600">{score}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-lg animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 shadow-lg ${
                  score >= 80 ? 'bg-gradient-to-br from-green-400 to-green-600' :
                  score >= 60 ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
                  score >= 40 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-br from-red-400 to-red-600'
                }`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{recommendation.title}</h2>
              </div>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{recommendation.message}</p>
              
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold mb-4 text-gray-900 text-xl flex items-center">
                  <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {selectedLanguage === 'hi' ? 'व्यक्तिगत सुझाव:' : 'Personalized Recommendations:'}
                </h3>
                <div className="grid gap-3">
                  {recommendation.tips.map((tip, index) => (
                    <div key={index} className="flex items-start p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100 hover:from-green-100 hover:to-teal-100 transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn" style={{animationDelay: '0.6s'}}>
                <h3 className="font-bold mb-4 text-blue-800 flex items-center text-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  {selectedLanguage === 'hi' ? 'अगले कदम' : 'Next Steps'}
                </h3>
                <div className="space-y-3">
                  {[
                    selectedLanguage === 'hi' ? 'डॉक्टर से सलाह लें' : 'Consult with a doctor',
                    selectedLanguage === 'hi' ? 'नियमित जांच कराएं' : 'Schedule regular checkups',
                    selectedLanguage === 'hi' ? 'स्वस्थ जीवनशैली अपनाएं' : 'Adopt healthy lifestyle'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center p-2 bg-white/50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-blue-800 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn" style={{animationDelay: '0.9s'}}>
                <h3 className="font-bold mb-4 text-red-800 flex items-center text-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mr-3 shadow-lg animate-pulse">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  {selectedLanguage === 'hi' ? 'आपातकालीन नंबर' : 'Emergency Numbers'}
                </h3>
                <div className="space-y-3">
                  {[
                    { number: '108', label: selectedLanguage === 'hi' ? 'राष्ट्रीय आपातकाल' : 'National Emergency' },
                    { number: '1075', label: selectedLanguage === 'hi' ? 'कोविड हेल्पलाइन' : 'COVID Helpline' },
                    { number: '1091', label: selectedLanguage === 'hi' ? 'महिला हेल्पलाइन' : 'Women Helpline' }
                  ].map((emergency, index) => (
                    <a key={index} href={`tel:${emergency.number}`} className="flex items-center p-2 bg-white/50 rounded-lg hover:bg-white/80 transition-colors group">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-red-800 font-bold">{emergency.number}</div>
                        <div className="text-red-600 text-sm">{emergency.label}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn" style={{animationDelay: '1.2s'}}>
              <button
                onClick={restartQuiz}
                className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {selectedLanguage === 'hi' ? 'फिर से करें' : 'Retake Assessment'}
              </button>
              <button
                onClick={() => window.location.href = '/chat'}
                className="group px-8 py-4 border-2 border-teal-600 text-teal-600 rounded-xl font-semibold hover:bg-teal-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {selectedLanguage === 'hi' ? 'डॉक्टर से बात करें' : 'Chat with Dr. AI'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-blue-50/30 py-12 px-4 relative overflow-hidden ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="ml-4 text-4xl font-bold text-gray-900">
              {selectedLanguage === 'hi' ? 'स्वास्थ्य मूल्यांकन' : 'Health Assessment'}
            </h1>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none px-6 py-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-lg hover:shadow-xl transition-shadow font-medium"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {selectedLanguage === 'hi' ? 'प्रश्न' : 'Question'} {currentQuestion + 1}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {questions.length} {selectedLanguage === 'hi' ? 'में से' : 'total'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-4 rounded-full transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-lg font-bold text-teal-600">{Math.round(progress)}% {selectedLanguage === 'hi' ? 'पूर्ण' : 'Complete'}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20 transition-all duration-300 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'} animate-fadeIn`} style={{animationDelay: '0.2s'}}>
          <div className="flex items-start mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg">{currentQuestion + 1}</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id]?.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, index, currentQ.type === 'multiple')}
                  className={`group w-full p-5 text-left rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                    isSelected
                      ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-lg'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-500 scale-110'
                        : 'border-gray-300 group-hover:border-teal-400 group-hover:scale-105'
                    }`}>
                      {isSelected && (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-lg font-medium transition-colors ${
                      isSelected ? 'text-teal-800' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>{option}</span>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                    isSelected ? 'bg-teal-500' : 'bg-gradient-to-r from-teal-500 to-blue-500'
                  }`}></div>
                </button>
              );
            })}
          </div>

          {currentQ.type === 'multiple' && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700 font-medium">
                  {selectedLanguage === 'hi' ? '💡 एक से अधिक विकल्प चुन सकते हैं' : '💡 You can select multiple options'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="group px-8 py-4 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {selectedLanguage === 'hi' ? 'पिछला' : 'Previous'}
          </button>

          {/* Progress indicator */}
          <div className="hidden md:flex space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuestion
                    ? 'bg-teal-600 scale-125'
                    : index < currentQuestion
                    ? 'bg-teal-400'
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id] || answers[currentQ.id].length === 0}
            className="group px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-teal-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 
              ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedLanguage === 'hi' ? 'परिणाम देखें' : 'View Results'}
                </>
              )
              : (
                <>
                  {selectedLanguage === 'hi' ? 'अगला' : 'Next'}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )
            }
          </button>
        </div>

        {/* Enhanced Info Panel */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 animate-fadeIn" style={{animationDelay: '0.6s'}}>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-3 text-gray-900 text-lg">
                {selectedLanguage === 'hi' ? 'यह क्यों महत्वपूर्ण है?' : 'Why This Assessment Matters?'}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {selectedLanguage === 'hi' 
                  ? 'यह मूल्यांकन आपकी स्वास्थ्य स्थिति को समझने और व्यक्तिगत सुझाव प्रदान करने में मदद करती है। आपकी जानकारी पूर्णतः सुरक्षित और गोपनीय है।'
                  : 'This assessment helps understand your health status and provides personalized recommendations. Your information is completely secure and confidential.'
                }
              </p>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <svg className="w-3 h-3 text-green-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-700 font-medium">
                    {selectedLanguage === 'hi' ? 'सुरक्षित' : 'Secure'}
                  </span>
                </div>
                <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                  <svg className="w-3 h-3 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-700 font-medium">
                    {selectedLanguage === 'hi' ? 'गोपनीय' : 'Private'}
                  </span>
                </div>
                <div className="flex items-center bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                  <svg className="w-3 h-3 text-purple-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-purple-700 font-medium">
                    {selectedLanguage === 'hi' ? 'विश्वसनीय' : 'Trusted'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthQuiz;
