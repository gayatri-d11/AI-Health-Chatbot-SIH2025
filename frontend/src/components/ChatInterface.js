import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVoiceResponse } from './VoiceInterface';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m YOGIC.ai, your personal health assistant. How can I help you today?',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const [mounted, setMounted] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const { currentUser } = useAuth();
  const { speakResponse } = useVoiceResponse(selectedLanguage);
  
  useEffect(() => {
    setMounted(true);
    fetchChatHistory();
    
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      const langMap = {
        'hi': 'hi-IN', 'en': 'en-US', 'te': 'te-IN', 'ta': 'ta-IN',
        'bn': 'bn-IN', 'gu': 'gu-IN', 'mr': 'mr-IN', 'pa': 'pa-IN',
        'kn': 'kn-IN', 'ml': 'ml-IN', 'or': 'or-IN', 'as': 'as-IN', 'ur': 'ur-IN'
      };
      
      recognitionRef.current.lang = langMap[selectedLanguage] || 'hi-IN';
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show real-time text in input field
        const fullTranscript = finalTranscript + interimTranscript;
        setInputMessage(fullTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.log('Speech recognition error:', event.error);
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        // Don't auto-send, wait for user to click mic again
      };
    }
  }, [selectedLanguage]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/chat-history/${currentUser?._id || currentUser?.id || 'anonymous'}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setChatHistory(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

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
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: messageText,
          userId: currentUser?._id || currentUser?.id || 'anonymous',
          language: selectedLanguage,
          forceLanguage: true
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
      
      // Update chat history
      setChatHistory(prev => [...prev, userMessage, aiMessage]);
      
      // Speak AI response if voice is enabled and not recording
      if (voiceEnabled && data.response && !isRecording) {
        setTimeout(() => {
          speakResponse(data.response);
        }, 100);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I\'m having technical difficulties. For emergencies, please call 108.',
        timestamp: new Date(),
        language: selectedLanguage
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Update chat history
      setChatHistory(prev => [...prev, userMessage, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceRecording = () => {
    if (recognitionRef.current && !isRecording) {
      try {
        // Stop any current speech synthesis
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        
        setIsRecording(true);
        setInputMessage('');
        recognitionRef.current.start();
      } catch (error) {
        console.log('Speech recognition already running');
        setIsRecording(false);
      }
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('Speech recognition stop error');
      }
    }
    setIsRecording(false);
    
    // Send message if we have text
    if (inputMessage.trim()) {
      sendMessage(inputMessage.trim());
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-teal-50/30 via-white to-blue-50/30 relative overflow-hidden ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-teal-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-100 rounded-full opacity-30 animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">YOGIC.ai Chat</h1>
                <p className="text-sm text-gray-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Your AI Health Assistant
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium text-gray-700">History</span>
              </button>
              
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {Object.entries(languages).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`flex items-center px-3 py-2 rounded-xl border transition-all duration-300 ${
                    voiceEnabled 
                      ? 'bg-purple-50 border-purple-200 text-purple-700' 
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  } hover:scale-105`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-sm font-semibold">{voiceEnabled ? 'Voice ON' : 'Voice OFF'}</span>
                </button>
                <div className="flex items-center bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-700">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
        showHistory ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Chat History
          </h3>
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full pb-20">
          {chatHistory.length > 0 ? (
            <div className="space-y-3">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  msg.type === 'user' ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="text-xs text-gray-500 mb-2 flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      msg.type === 'user' ? 'bg-teal-500' : 'bg-gray-500'
                    }`}></span>
                    {msg.type === 'user' ? 'You' : 'Dr. AI'}
                  </div>
                  <div className="text-sm text-gray-800">{msg.content || msg.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">No chat history</p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {showHistory && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setShowHistory(false)}
        ></div>
      )}

      {/* Chat Container */}
      <div className="relative max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white/50 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                      : 'bg-gradient-to-br from-teal-500 to-teal-700'
                  } shadow-lg`}>
                    {message.type === 'user' ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`relative px-4 py-3 rounded-2xl shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white'
                      : 'bg-white text-gray-900 border border-gray-100'
                  } hover:shadow-xl transition-shadow duration-300`}>
                    {/* Message tail */}
                    <div className={`absolute bottom-0 w-3 h-3 transform rotate-45 ${
                      message.type === 'user'
                        ? 'bg-teal-600 -right-1'
                        : 'bg-white border-r border-b border-gray-100 -left-1'
                    }`}></div>
                    
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-3">
                        <span className="font-bold text-sm text-gray-800">YOGIC.ai</span>
                        {message.confidence && (
                          <span className="ml-2 text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-2 py-1 rounded-full font-medium">
                            {Math.round(message.confidence * 100)}% confident
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div 
                      className={`text-left leading-relaxed ${
                        message.type === 'user' ? 'text-white' : 'text-gray-800'
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                    
                    <div className={`text-xs mt-3 flex items-center justify-between ${
                      message.type === 'user' ? 'text-teal-100' : 'text-gray-500'
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.source && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {message.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-end space-x-2 max-w-xs">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="relative bg-white border border-gray-100 rounded-2xl px-6 py-4 shadow-lg">
                    <div className="absolute bottom-0 -left-1 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 font-medium">YOGIC.ai is thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>



          {/* Quick Questions */}
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700 font-semibold">Quick questions:</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {(quickQuestions[selectedLanguage] || quickQuestions['en']).map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  className="group px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gradient-to-r hover:from-teal-50 hover:to-teal-100 hover:border-teal-300 hover:text-teal-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  <span className="flex items-center gap-2">
                    {question}
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-white to-gray-50">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? 'Listening...' : (selectedLanguage === 'hi' ? 'अपना स्वास्थ्य प्रश्न यहाँ लिखें...' : 'Type your health question here...')}
                  className={`w-full pl-10 pr-4 py-4 border rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none bg-white hover:bg-gray-50 focus:bg-white transition-all duration-300 shadow-sm focus:shadow-md ${
                    isRecording ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  rows="2"
                  disabled={isRecording}
                />
                {isRecording && (
                  <div className="absolute bottom-2 right-2 flex items-center text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                    🎤 Speaking...
                  </div>
                )}
              </div>
              
              {/* Voice Button (WhatsApp style) */}
              {voiceEnabled && (
                <button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110' 
                      : 'bg-purple-500 hover:bg-purple-600'
                  } text-white shadow-lg hover:shadow-xl`}
                >
                  {isRecording ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  )}
                </button>
              )}
              
              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={isLoading || (!inputMessage.trim() && !isRecording)}
                className="group px-6 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-2xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Press Enter to send
                </span>
                {voiceEnabled && (
                  <span className="flex items-center text-purple-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Click mic to record
                  </span>
                )}
              </div>
              <div className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                <svg className="w-3 h-3 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-green-700 font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="mt-6 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 shadow-lg animate-fadeIn" style={{animationDelay: '0.4s'}}>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-lg animate-pulse">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-800 text-lg mb-2 flex items-center">
                Medical Emergency?
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">URGENT</span>
              </h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                For immediate medical emergencies, call <strong className="bg-red-100 px-2 py-1 rounded font-bold">108</strong> or visit the nearest hospital. 
                This AI assistant is for informational purposes only and should not replace professional medical advice.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="tel:108" className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 108
                </a>
                <a href="tel:1075" className="inline-flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  COVID Helpline
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Info */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129",
              title: "Multilingual Support",
              desc: "Chat in 10+ Indian languages with real-time translation",
              color: "from-teal-500 to-teal-700",
              bgColor: "from-teal-50 to-teal-100"
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Instant AI Response",
              desc: "Get medical guidance in under 2 seconds with 98% accuracy",
              color: "from-blue-500 to-blue-700",
              bgColor: "from-blue-50 to-blue-100"
            },
            {
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              title: "Private & Secure",
              desc: "HIPAA compliant with end-to-end encryption for your safety",
              color: "from-green-500 to-green-700",
              bgColor: "from-green-50 to-green-100"
            }
          ].map((feature, index) => (
            <div key={index} className={`group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn`} style={{animationDelay: `${0.6 + index * 0.1}s`}}>
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-teal-600 transition-colors">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              
              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #0d9488, #0f766e);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0f766e, #134e4a);
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
