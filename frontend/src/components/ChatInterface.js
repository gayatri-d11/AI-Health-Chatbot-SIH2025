import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '🩺 Hello! I\'m Dr. AI, your personal health assistant. How can I help you today?',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();

  const languages = {
    'en': 'English',
    'hi': 'Hindi (हिंदी)',
    'te': 'Telugu (తెలుగు)',
    'ta': 'Tamil (தமிழ்)',
    'bn': 'Bengali (বাংলা)',
    'gu': 'Gujarati (ગુજરાતી)',
    'mr': 'Marathi (मराठी)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'ml': 'Malayalam (മലയാളം)'
  };

  const quickQuestions = {
    'en': [
      'I have fever and headache',
      'What are COVID symptoms?',
      'How to reduce blood pressure?',
      'Diabetes diet tips',
      'Emergency numbers'
    ],
    'hi': [
      'मुझे बुखार और सिरदर्द है',
      'कोविड के लक्षण क्या हैं?',
      'ब्लड प्रेशर कैसे कम करें?',
      'डायबिटीज डाइट टिप्स',
      'आपातकालीन नंबर'
    ]
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: messageText,
          userId: currentUser?.id || 'anonymous',
          language: selectedLanguage
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response || 'Sorry, I couldn\'t process your request.',
        timestamp: new Date(),
        language: data.responseLanguage || selectedLanguage,
        confidence: data.confidence,
        source: data.source
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '🚨 Sorry, I\'m having technical difficulties. For emergencies, please call 108.',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">🩺</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Dr. AI Chat</h1>
                <p className="text-sm text-gray-500">Your AI Health Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
              <div className="flex items-center text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">🩺</span>
                      <span className="font-semibold text-sm">Dr. AI</span>
                      {message.confidence && (
                        <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          {Math.round(message.confidence * 100)}% confident
                        </span>
                      )}
                    </div>
                  )}
                  <div 
                    className="whitespace-pre-wrap text-left"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                    {message.source && (
                      <span className="ml-2">• {message.source}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🩺</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {(quickQuestions[selectedLanguage] || quickQuestions['en']).map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedLanguage === 'hi' ? 'अपना स्वास्थ्य प्रश्न यहाँ लिखें...' : 'Type your health question here...'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="2"
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">📤</span>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span>🔒 Your conversations are private and secure</span>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🚨</span>
            <div>
              <h3 className="font-semibold text-red-800">Medical Emergency?</h3>
              <p className="text-red-600 text-sm">
                For immediate medical emergencies, call <strong>108</strong> or visit the nearest hospital. 
                This AI assistant is for informational purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="font-semibold mb-1">Multilingual</h3>
            <p className="text-sm text-gray-600">Chat in 10+ Indian languages</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Instant Response</h3>
            <p className="text-sm text-gray-600">Get answers in under 2 seconds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold mb-1">Private & Secure</h3>
            <p className="text-sm text-gray-600">Your health data is protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;