import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EnhancedChatInterface = () => {
  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      title: 'Fever and headache symptoms',
      timestamp: new Date(Date.now() - 86400000),
      messages: [
        { id: 1, type: 'ai', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 86400000) },
        { id: 2, type: 'user', content: 'I have fever and headache', timestamp: new Date(Date.now() - 86400000) }
      ]
    },
    {
      id: 2,
      title: 'Blood pressure concerns',
      timestamp: new Date(Date.now() - 172800000),
      messages: [
        { id: 1, type: 'ai', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 172800000) },
        { id: 2, type: 'user', content: 'How to reduce blood pressure?', timestamp: new Date(Date.now() - 172800000) }
      ]
    }
  ]);
  
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m YOGIC.ai, your personal health assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
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

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      const langMap = {
        'hi': 'hi-IN', 'en': 'en-US', 'te': 'te-IN', 'ta': 'ta-IN',
        'bn': 'bn-IN', 'gu': 'gu-IN', 'mr': 'mr-IN', 'pa': 'pa-IN',
        'kn': 'kn-IN', 'ml': 'ml-IN'
      };
      
      recognitionRef.current.lang = langMap[selectedLanguage] || 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInputMessage(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewChat = () => {
    setCurrentSessionId(null);
    setCurrentMessages([
      {
        id: Date.now(),
        type: 'ai',
        content: 'Hello! I\'m YOGIC.ai, your personal health assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
  };

  const loadChatSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setCurrentMessages(session.messages);
    }
  };

  const generateChatTitle = (message) => {
    return message.length > 30 ? message.substring(0, 30) + '...' : message;
  };

  const saveChatSession = (messages) => {
    if (messages.length > 1) {
      const userMessage = messages.find(m => m.type === 'user');
      if (userMessage && !currentSessionId) {
        const newSession = {
          id: Date.now(),
          title: generateChatTitle(userMessage.content),
          timestamp: new Date(),
          messages: [...messages]
        };
        setChatSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
      } else if (currentSessionId) {
        setChatSessions(prev => prev.map(session => 
          session.id === currentSessionId 
            ? { ...session, messages: [...messages], timestamp: new Date() }
            : session
        ));
      }
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    const newMessages = [...currentMessages, userMessage];
    setCurrentMessages(newMessages);
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
          language: selectedLanguage
        })
      });

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.response || 'Sorry, I couldn\'t process your request.',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, aiMessage];
      setCurrentMessages(finalMessages);
      saveChatSession(finalMessages);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I\'m having technical difficulties. For emergencies, please call 108.',
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMessage];
      setCurrentMessages(finalMessages);
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
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString();
  };

  const deleteChatSession = (sessionId, e) => {
    e.stopPropagation();
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      createNewChat();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                onClick={() => loadChatSession(session.id)}
                className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentSessionId === session.id 
                    ? 'bg-gray-700 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(session.timestamp)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChatSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">{currentUser?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={sidebarOpen ? 'Hide History' : 'Show History'}
              >
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">History</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">YOGIC.ai Assistant</h1>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-600'
                }`}>
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
                
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div 
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">YOGIC.ai is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedLanguage === 'hi' ? 'अपना स्वास्थ्य प्रश्न यहाँ लिखें...' : 'Type your health question here...'}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                  isRecording ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                rows="2"
                disabled={isRecording}
              />
              {isRecording && (
                <div className="absolute bottom-2 right-2 flex items-center text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                  Recording...
                </div>
              )}
            </div>
            
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`p-3 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure & Private
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;