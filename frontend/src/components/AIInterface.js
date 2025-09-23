import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ChatGPTInterface = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([
    { id: 1, type: 'assistant', content: 'Hello! I\'m your AI health assistant. How can I help you today?', timestamp: new Date() }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showContextMenu, setShowContextMenu] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    if (currentUser) {
      loadConversationHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showContextMenu && !event.target.closest('.context-menu')) {
        setShowContextMenu(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showContextMenu]);

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: [
        { id: Date.now(), type: 'assistant', content: 'Hello! I\'m your AI health assistant. How can I help you today?', timestamp: new Date() }
      ]
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setCurrentMessages(newConversation.messages);
    setShowContextMenu(null);
  };

  const loadConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setCurrentMessages(conversation.messages);
    }
  };

  const updateConversationTitle = (messages) => {
    const userMessage = messages.find(m => m.type === 'user');
    if (userMessage) {
      const title = generateConversationTitle(userMessage.content);
      
      if (currentConversationId) {
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, title, messages, timestamp: new Date() }
            : conv
        ));
      }
    }
  };

  const sendMessage = async (messageText = inputMessage, imageFile = null) => {
    if (!messageText.trim() && !imageFile) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      image: imageFile ? URL.createObjectURL(imageFile) : null,
      timestamp: new Date()
    };

    const newMessages = [...currentMessages, userMessage];
    setCurrentMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // API call to backend
      console.log('Sending message to backend:', messageText);
      
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          message: messageText,
          language: 'en'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, assistantMessage];
      setCurrentMessages(finalMessages);
      updateConversationTitle(finalMessages);

      // Voice is now manual - user clicks button to listen

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      const finalMessages = [...newMessages, errorMessage];
      setCurrentMessages(finalMessages);
    }

    setIsLoading(false);
  };

  const generateMockResponse = (message) => {
    const responses = [
      "Based on your symptoms, I recommend consulting with a healthcare professional for proper evaluation.",
      "Thank you for sharing that information. Here are some general health recommendations...",
      "I understand your concern. For medical advice, please consult with a qualified healthcare provider.",
      "That's an important health question. Let me provide some general guidance..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      sendMessage('I\'ve uploaded an image for analysis.', file);
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const toggleSpeaking = (messageId, content) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === messageId) {
        // Stop speaking
        speechSynthesis.cancel();
        setSpeakingMessageId(null);
      } else {
        // Start speaking
        speechSynthesis.cancel(); // Stop any current speech
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.onstart = () => setSpeakingMessageId(messageId);
        utterance.onend = () => setSpeakingMessageId(null);
        speechSynthesis.speak(utterance);
      }
    }
  };

  const downloadConversation = () => {
    const conversation = currentMessages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversation.txt';
    a.click();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateConversationTitle = (message) => {
    if (!message || message.trim() === '') return 'New Chat';
    
    // Clean the message
    const cleanMessage = message.trim();
    
    // Generate smart titles like ChatGPT
    const words = cleanMessage.toLowerCase().split(' ');
    if (words.includes('health') || words.includes('symptom')) return 'Health Consultation';
    if (words.includes('pain') || words.includes('hurt')) return 'Pain Assessment';
    if (words.includes('medicine') || words.includes('medication')) return 'Medication Inquiry';
    if (words.includes('diet') || words.includes('food')) return 'Diet & Nutrition';
    if (words.includes('exercise') || words.includes('workout')) return 'Exercise Guidance';
    if (words.includes('fever') || words.includes('temperature')) return 'Fever Symptoms';
    if (words.includes('headache') || words.includes('migraine')) return 'Headache Relief';
    if (words.includes('cold') || words.includes('cough')) return 'Cold & Cough';
    if (words.includes('stress') || words.includes('anxiety')) return 'Mental Health';
    
    // Fallback: Use first 3-4 words or 50 characters max
    const firstWords = cleanMessage.split(' ').slice(0, 4).join(' ');
    return firstWords.length > 50 ? firstWords.substring(0, 50) + '...' : firstWords;
  };

  const renameConversation = (id, newTitle) => {
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, title: newTitle.trim() || 'New Chat' } : conv
    ));
    setEditingTitleId(null);
    setEditingTitle('');
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      const remaining = conversations.filter(c => c.id !== id);
      if (remaining.length > 0) {
        loadConversation(remaining[0].id);
      } else {
        createNewConversation();
      }
    }
    setShowContextMenu(null);
  };

  const exportConversation = (conversation) => {
    const content = `Chat: ${conversation.title}\nDate: ${conversation.timestamp.toLocaleString()}\n\n` +
      conversation.messages.map(msg => 
        `${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`
      ).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversation.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setShowContextMenu(null);
  };

  const duplicateConversation = (conversation) => {
    const newConv = {
      ...conversation,
      id: Date.now(),
      title: `${conversation.title} (Copy)`,
      timestamp: new Date()
    };
    setConversations(prev => [newConv, ...prev]);
    setShowContextMenu(null);
  };

  const loadConversationHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/chat/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.chatHistory && data.chatHistory.length > 0) {
          const conversationsFromHistory = data.chatHistory.map((chat, index) => {
            const userMessage = {
              id: `${index}-user`,
              type: 'user',
              content: chat.message,
              timestamp: new Date(chat.timestamp)
            };
            
            const assistantMessage = {
              id: `${index}-assistant`,
              type: 'assistant', 
              content: chat.response,
              timestamp: new Date(chat.timestamp)
            };
            
            return {
              id: index + 1,
              title: generateConversationTitle(chat.message),
              timestamp: new Date(chat.timestamp),
              messages: [
                { id: `${index}-welcome`, type: 'assistant', content: 'Hello! I\'m your AI health assistant. How can I help you today?', timestamp: new Date(chat.timestamp) },
                userMessage, 
                assistantMessage
              ]
            };
          });
          
          setConversations(conversationsFromHistory.reverse());
        }
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  const isToday = (timestamp) => {
    const today = new Date();
    const date = new Date(timestamp);
    return date.toDateString() === today.toDateString();
  };

  const isYesterday = (timestamp) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const date = new Date(timestamp);
    return date.toDateString() === yesterday.toDateString();
  };

  const isPrevious7Days = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 2 && diffDays <= 7;
  };

  const isOlder = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  };

  const ConversationItem = ({ conversation }) => (
    <div
      className={`group relative flex items-center px-3 py-2 mx-1 my-0.5 rounded-lg cursor-pointer transition-all ${
        currentConversationId === conversation.id 
          ? darkMode ? 'bg-gray-700' : 'bg-gray-200'
          : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      }`}
      onClick={() => loadConversation(conversation.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowContextMenu(conversation.id);
      }}
    >
      <svg className={`w-4 h-4 mr-3 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      
      <div className="flex-1 min-w-0">
        {editingTitleId === conversation.id ? (
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={() => renameConversation(conversation.id, editingTitle)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                renameConversation(conversation.id, editingTitle);
              }
            }}
            className={`w-full text-sm ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'} border-0 focus:ring-1 focus:ring-blue-500 rounded px-1`}
            autoFocus
          />
        ) : (
          <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
            {conversation.title}
          </p>
        )}
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowContextMenu(showContextMenu === conversation.id ? null : conversation.id);
          }}
          className={`p-1 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'} rounded transition-all flex-shrink-0`}
        >
          <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      
      {/* Context Menu */}
      {showContextMenu === conversation.id && (
        <div className={`absolute right-0 top-8 z-50 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg py-1 min-w-[150px]`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setEditingTitleId(conversation.id);
              setEditingTitle(conversation.title);
              setShowContextMenu(null);
            }}
            className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
          >
            Rename
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateConversation(conversation);
            }}
            className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
          >
            Duplicate
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              exportConversation(conversation);
            }}
            className={`w-full text-left px-3 py-2 text-sm ${darkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
          >
            Export
          </button>
          <hr className={`my-1 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteConversation(conversation.id);
            }}
            className={`w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 ${darkMode ? 'hover:bg-red-900/20' : ''} transition-colors`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar Tab */}
      {!sidebarOpen && (
        <div className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`w-8 h-16 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border-r border-t border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-r-lg flex items-center justify-center shadow-lg transition-all`}
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col overflow-hidden relative`}>

        {/* Sidebar Header */}
        {sidebarOpen && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
            <button
              onClick={createNewConversation}
              className={`flex items-center justify-center w-10 h-10 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} rounded-lg transition-colors`}
              title="New Chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-center w-8 h-8 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} rounded-lg transition-colors`}
              title="Close Sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Search */}
        {sidebarOpen && (
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900'} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <svg className={`absolute left-3 top-2.5 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {/* Conversations List */}
        {sidebarOpen ? (
          <div className="flex-1 overflow-y-auto">
            {/* Today Section */}
            {filteredConversations.filter(c => isToday(c.timestamp)).length > 0 && (
              <div className="px-3 py-2">
                <h3 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                  Today
                </h3>
                {filteredConversations.filter(c => isToday(c.timestamp)).map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </div>
            )}
            
            {/* Yesterday Section */}
            {filteredConversations.filter(c => isYesterday(c.timestamp)).length > 0 && (
              <div className="px-3 py-2">
                <h3 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                  Yesterday
                </h3>
                {filteredConversations.filter(c => isYesterday(c.timestamp)).map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </div>
            )}
            
            {/* Previous 7 Days */}
            {filteredConversations.filter(c => isPrevious7Days(c.timestamp)).length > 0 && (
              <div className="px-3 py-2">
                <h3 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                  Previous 7 Days
                </h3>
                {filteredConversations.filter(c => isPrevious7Days(c.timestamp)).map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </div>
            )}
            
            {/* Older */}
            {filteredConversations.filter(c => isOlder(c.timestamp)).length > 0 && (
              <div className="px-3 py-2">
                <h3 className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                  Older
                </h3>
                {filteredConversations.filter(c => isOlder(c.timestamp)).map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))}
              </div>
            )}
            
            {filteredConversations.length === 0 && (
              <div className={`px-3 py-8 text-center`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  No conversations yet
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-2">
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={createNewConversation}
                className={`p-2 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} rounded-lg transition-colors`}
                title="New chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              
              {/* Show recent conversations as small icons when sidebar is collapsed */}
              {conversations.slice(0, 5).map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    loadConversation(conversation.id);
                    setSidebarOpen(true); // Auto-expand sidebar when selecting a conversation
                  }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    currentConversationId === conversation.id
                      ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  title={conversation.title}
                >
                  {conversation.title.charAt(0).toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-center space-x-4`}>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center justify-center w-10 h-10 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} rounded-lg transition-colors`}
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center justify-center w-10 h-10 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} rounded-lg transition-colors`}
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && sidebarOpen && (
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-800' : 'bg-white'} z-10 flex flex-col`}>
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`w-8 h-8 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} rounded-lg transition-colors flex items-center justify-center`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 p-4 space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Theme</label>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg transition-colors`}
                >
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
                  <div className={`w-12 h-6 ${darkMode ? 'bg-blue-600' : 'bg-gray-300'} rounded-full relative transition-colors`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                  </div>
                </button>
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Export Data</label>
                <button
                  onClick={downloadConversation}
                  className={`w-full flex items-center p-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-lg transition-colors`}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Chat History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-full flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  YOGIC.ai
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-4">
            {currentMessages.map((message) => (
              <div key={message.id} className={`mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-2xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? darkMode ? 'bg-blue-600' : 'bg-blue-500'
                      : darkMode ? 'bg-green-600' : 'bg-green-500'
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
                  
                  <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center space-x-2 mb-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {message.type === 'user' ? 'You' : 'YOGIC.ai'}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded" 
                        className={`max-w-sm rounded-lg mb-3 border ${message.type === 'user' ? 'ml-auto' : ''}`}
                      />
                    )}
                    
                    <div className={`${message.type === 'user' 
                      ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                      : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                    } rounded-2xl px-4 py-3 inline-block max-w-full`}>
                      <p className="leading-relaxed whitespace-pre-wrap text-left text-sm">
                        {message.content}
                      </p>
                    </div>
                    
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className={`p-1 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} rounded transition-colors`}
                          title="Copy message"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => toggleSpeaking(message.id, message.content)}
                          className={`p-1 ${speakingMessageId === message.id 
                            ? darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'
                            : darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'
                          } rounded transition-colors ${speakingMessageId === message.id ? 'animate-pulse' : ''}`}
                          title={speakingMessageId === message.id ? "Stop speaking" : "Listen to message"}
                        >
                          {speakingMessageId === message.id ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 9v6l4-3-4-3z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mb-6 flex justify-start">
                <div className="flex items-start space-x-3 max-w-2xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-600' : 'bg-green-500'}`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>AI Assistant</span>
                    </div>
                    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-2xl px-4 py-3 inline-block`}>
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`}></div>
                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{animationDelay: '0.1s'}}></div>
                        <div className={`w-2 h-2 ${darkMode ? 'bg-gray-400' : 'bg-gray-500'} rounded-full animate-bounce`} style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4 flex-shrink-0`}>
          <div className="max-w-4xl mx-auto">
            <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} border rounded-xl p-3`}>
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Message YOGIC.ai..."
                    className={`w-full ${darkMode ? 'bg-transparent text-white placeholder-gray-400' : 'bg-transparent text-gray-900 placeholder-gray-500'} border-0 resize-none focus:ring-0 focus:outline-none`}
                    rows="1"
                    style={{ minHeight: '20px', maxHeight: '100px' }}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} rounded-lg transition-colors`}
                    title="Upload image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={handleVoiceInput}
                    className={`p-2 ${isRecording ? 'bg-red-500 text-white' : darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} rounded-lg transition-colors`}
                    title={isRecording ? 'Stop recording' : 'Voice input'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => sendMessage()}
                    disabled={!inputMessage.trim() && !isLoading}
                    className={`p-2 ${
                      inputMessage.trim() 
                        ? darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        : darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500'
                    } rounded-lg transition-colors disabled:cursor-not-allowed`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center mt-2`}>
              YOGIC.ai can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;