import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const HealthQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showResults, setShowResults] = useState(false);
  const { currentUser } = useAuth();

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

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeQuiz = () => {
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
    setQuizCompleted(true);
    setShowResults(true);
  };

  const getHealthRecommendations = () => {
    const recommendations = {
      en: {
        excellent: {
          title: "🌟 Excellent Health!",
          message: "You're doing great! Keep maintaining your healthy lifestyle.",
          tips: [
            "Continue regular exercise routine",
            "Maintain balanced diet",
            "Keep up with regular health checkups",
            "Stay hydrated and get adequate sleep"
          ]
        },
        good: {
          title: "👍 Good Health",
          message: "You're on the right track! A few improvements can make you even healthier.",
          tips: [
            "Increase physical activity if possible",
            "Focus on stress management",
            "Ensure 7-8 hours of sleep daily",
            "Consider regular health screenings"
          ]
        },
        fair: {
          title: "⚠️ Fair Health",
          message: "There's room for improvement. Consider making some lifestyle changes.",
          tips: [
            "Start with 30 minutes of daily exercise",
            "Improve your diet with more fruits and vegetables",
            "Quit smoking/tobacco if applicable",
            "Schedule a health checkup soon"
          ]
        },
        poor: {
          title: "🚨 Health Needs Attention",
          message: "Your health needs immediate attention. Please consult a healthcare provider.",
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
          title: "🌟 उत्कृष्ट स्वास्थ्य!",
          message: "आप बहुत अच्छा कर रहे हैं! अपनी स्वस्थ जीवनशैली बनाए रखें।",
          tips: [
            "नियमित व्यायाम जारी रखें",
            "संतुलित आहार बनाए रखें",
            "नियमित स्वास्थ्य जांच कराते रहें",
            "पर्याप्त पानी पिएं और अच्छी नींद लें"
          ]
        },
        good: {
          title: "👍 अच्छा स्वास्थ्य",
          message: "आप सही रास्ते पर हैं! कुछ सुधार आपको और भी स्वस्थ बना सकते हैं।",
          tips: [
            "यदि संभव हो तो शारीरिक गतिविधि बढ़ाएं",
            "तनाव प्रबंधन पर ध्यान दें",
            "रोज 7-8 घंटे की नींद सुनिश्चित करें",
            "नियमित स्वास्थ्य जांच कराएं"
          ]
        },
        fair: {
          title: "⚠️ ठीक-ठाक स्वास्थ्य",
          message: "सुधार की गुंजाइश है। कुछ जीवनशैली में बदलाव करने पर विचार करें।",
          tips: [
            "रोज 30 मिनट व्यायाम से शुरुआत करें",
            "अधिक फल और सब्जियों के साथ आहार सुधारें",
            "धूम्रपान/तंबाकू छोड़ें यदि लागू हो",
            "जल्द स्वास्थ्य जांच कराएं"
          ]
        },
        poor: {
          title: "🚨 स्वास्थ्य पर ध्यान दें",
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedLanguage === 'hi' ? 'क्विज पूरी हुई!' : 'Quiz Completed!'}
              </h1>
              <p className="text-gray-600">
                {selectedLanguage === 'hi' ? 'आपका स्वास्थ्य स्कोर:' : 'Your Health Score:'}
              </p>
              <div className="text-5xl font-bold text-blue-600 mt-4">{score}%</div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">{recommendation.title}</h2>
              <p className="text-gray-700 mb-4">{recommendation.message}</p>
              
              <h3 className="font-semibold mb-3">
                {selectedLanguage === 'hi' ? '📋 सुझाव:' : '📋 Recommendations:'}
              </h3>
              <ul className="space-y-2">
                {recommendation.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold mb-3 text-blue-800">
                  {selectedLanguage === 'hi' ? '🏥 अगले कदम' : '🏥 Next Steps'}
                </h3>
                <ul className="text-sm space-y-2 text-blue-700">
                  <li>• {selectedLanguage === 'hi' ? 'डॉक्टर से सलाह लें' : 'Consult with a doctor'}</li>
                  <li>• {selectedLanguage === 'hi' ? 'नियमित जांच कराएं' : 'Schedule regular checkups'}</li>
                  <li>• {selectedLanguage === 'hi' ? 'स्वस्थ जीवनशैली अपनाएं' : 'Adopt healthy lifestyle'}</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <h3 className="font-semibold mb-3 text-green-800">
                  {selectedLanguage === 'hi' ? '📞 आपातकालीन नंबर' : '📞 Emergency Numbers'}
                </h3>
                <ul className="text-sm space-y-2 text-green-700">
                  <li>• {selectedLanguage === 'hi' ? 'राष्ट्रीय आपातकाल: 108' : 'National Emergency: 108'}</li>
                  <li>• {selectedLanguage === 'hi' ? 'कोविड हेल्पलाइन: 1075' : 'COVID Helpline: 1075'}</li>
                  <li>• {selectedLanguage === 'hi' ? 'महिला हेल्पलाइन: 1091' : 'Women Helpline: 1091'}</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {selectedLanguage === 'hi' ? '🔄 फिर से करें' : '🔄 Retake Quiz'}
              </button>
              <button
                onClick={() => window.location.href = '/chat'}
                className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
              >
                {selectedLanguage === 'hi' ? '💬 डॉक्टर से बात करें' : '💬 Chat with Dr. AI'}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎯</span>
            </div>
            <h1 className="ml-3 text-3xl font-bold text-gray-900">
              {selectedLanguage === 'hi' ? 'स्वास्थ्य क्विज' : 'Health Assessment Quiz'}
            </h1>
          </div>
          
          <div className="flex justify-center mb-6">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-600">
            {selectedLanguage === 'hi' ? 'प्रश्न' : 'Question'} {currentQuestion + 1} {selectedLanguage === 'hi' ? 'का' : 'of'} {questions.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index, currentQ.type === 'multiple')}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  answers[currentQ.id]?.includes(index)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    answers[currentQ.id]?.includes(index)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[currentQ.id]?.includes(index) && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {currentQ.type === 'multiple' && (
            <p className="mt-4 text-sm text-gray-500">
              {selectedLanguage === 'hi' ? 'एक से अधिक विकल्प चुन सकते हैं' : 'You can select multiple options'}
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← {selectedLanguage === 'hi' ? 'पिछला' : 'Previous'}
          </button>

          <button
            onClick={nextQuestion}
            disabled={!answers[currentQ.id] || answers[currentQ.id].length === 0}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 
              ? (selectedLanguage === 'hi' ? 'परिणाम देखें' : 'See Results')
              : (selectedLanguage === 'hi' ? 'अगला' : 'Next')
            } →
          </button>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold mb-3">
            {selectedLanguage === 'hi' ? '💡 क्यों यह महत्वपूर्ण है?' : '💡 Why This Matters?'}
          </h3>
          <p className="text-gray-600 text-sm">
            {selectedLanguage === 'hi' 
              ? 'यह क्विज आपके स्वास्थ्य की स्थिति को समझने और व्यक्तिगत सुझाव प्रदान करने में मदद करती है। आपकी जानकारी पूर्णतः सुरक्षित और गोपनीय है।'
              : 'This quiz helps understand your health status and provides personalized recommendations. Your information is completely secure and confidential.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthQuiz;