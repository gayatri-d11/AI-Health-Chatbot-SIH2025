import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewUserDashboard = () => {
  const [activeSection, setActiveSection] = useState('chatbot');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I\'m Dr. AI, your personal health assistant. How can I help you today?', time: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const languages = [
    'English', 'Hindi', 'हिंदी', 'తెలుగు', 'தமிழ்', 'বাংলা', 
    'ગુજરાતી', 'मराठी', 'ਪੰਜਾਬੀ', 'ಕನ್ನಡ', 'മലയാളം'
  ];

  const sidebarItems = [
    {
      id: 'chatbot',
      label: '🩺 AI Doctor',
      icon: '💬',
      color: 'from-blue-500 to-blue-600',
      description: 'Chat with AI Doctor'
    },
    {
      id: 'alerts',
      label: '🚨 Health Alerts',
      icon: '⚠️',
      color: 'from-red-500 to-red-600',
      description: 'Emergency & Alerts'
    },
    {
      id: 'vaccination',
      label: '💉 Vaccination',
      icon: '🏥',
      color: 'from-green-500 to-green-600',
      description: 'Vaccine Centers'
    },
    {
      id: 'resources',
      label: '📚 Health Tips',
      icon: '💡',
      color: 'from-purple-500 to-purple-600',
      description: 'Health Resources'
    },
    {
      id: 'profile',
      label: '👤 My Profile',
      icon: '⚙️',
      color: 'from-gray-500 to-gray-600',
      description: 'Account Settings'
    }
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      time: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Thank you for your question. Based on your symptoms, I recommend consulting with a healthcare professional. In the meantime, ensure you stay hydrated and get adequate rest.',
        time: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderChatInterface = () => (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🩺</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">Dr. AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-100 text-sm">Online • Ready to help</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-sm">Available 24/7</div>
            <div className="text-white font-semibold">Free Consultation</div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
              message.type === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                : 'bg-white text-gray-800 border border-gray-200'
            }`}>
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-2xl shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your health question here..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            Send
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>🔒 Your conversations are private and secure</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'chatbot':
        return renderChatInterface();
      case 'alerts':
        return <HealthAlertsSection />;
      case 'vaccination':
        return <VaccinationSection />;
      case 'resources':
        return <ResourcesSection />;
      case 'profile':
        return <ProfileSection currentUser={currentUser} />;
      default:
        return renderChatInterface();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex overflow-hidden">
      {/* Enhanced Professional Sidebar */}
      <div className="w-80 bg-white shadow-2xl border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">Health Assistant</h2>
              <p className="text-blue-100 text-sm">AI-Powered Healthcare</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{currentUser?.name}</p>
              <p className="text-sm text-gray-600">Premium User</p>
            </div>
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 text-left group ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                  : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                activeSection === item.id 
                  ? 'bg-white/20' 
                  : 'bg-gradient-to-r ' + item.color + ' text-white group-hover:scale-110 transition-transform'
              }`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{item.label}</div>
                <div className={`text-xs ${
                  activeSection === item.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </button>
          ))}
        </nav>

        {/* Emergency & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2">
            <span>🚨</span>
            <span>Emergency: Call 108</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 text-gray-700 p-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-gray-600">Professional healthcare at your fingertips</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">AI Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-hidden">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Health Alerts Section Component
const HealthAlertsSection = () => (
  <div className="h-full bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-xl p-6 overflow-y-auto">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">🚨 Health Alerts & Notifications</h3>
      <p className="text-gray-600">Stay informed about health emergencies and important updates</p>
    </div>
    
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-lg">High Priority Alert</h4>
              <p className="text-red-100 mt-1">Dengue outbreak reported in your area. Take immediate precautions.</p>
              <div className="mt-3 flex space-x-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">URGENT</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">🌡️</span>
          <div>
            <h4 className="font-bold text-lg">Weather Health Advisory</h4>
            <p className="text-orange-100 mt-1">Extreme heat wave expected. Stay hydrated and avoid outdoor activities.</p>
            <div className="mt-3 flex space-x-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">MEDIUM</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">5 hours ago</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💉</span>
          <div>
            <h4 className="font-bold text-lg">Vaccination Update</h4>
            <p className="text-blue-100 mt-1">New COVID-19 booster shots available at nearby health centers.</p>
            <div className="mt-3 flex space-x-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">INFO</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
      <h4 className="font-bold text-gray-900 mb-4">📱 Emergency Contacts</h4>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-red-500 text-white p-4 rounded-lg font-semibold hover:bg-red-600 transition-colors">
          🚑 Emergency: 108
        </button>
        <button className="bg-blue-500 text-white p-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
          🏥 COVID Help: 1075
        </button>
      </div>
    </div>
  </div>
);

// Vaccination Section Component
const VaccinationSection = () => (
  <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 overflow-y-auto">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">💉 Vaccination Center Finder</h3>
      <p className="text-gray-600">Find nearby vaccination centers and book appointments</p>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6 mb-6">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">🏥</span>
          <div>
            <h4 className="font-bold text-xl">Find Centers</h4>
            <p className="text-green-100">Locate vaccination centers near you</p>
          </div>
        </div>
        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors w-full">
          🔍 Search Centers
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">📅</span>
          <div>
            <h4 className="font-bold text-xl">My Schedule</h4>
            <p className="text-blue-100">Track your vaccination timeline</p>
          </div>
        </div>
        <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors w-full">
          📋 View Schedule
        </button>
      </div>
    </div>
    
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h4 className="font-bold text-gray-900 mb-4">🎯 Available Vaccines</h4>
      <div className="space-y-3">
        {[
          { name: 'COVID-19 Booster', status: 'Available', color: 'green' },
          { name: 'Influenza (Flu)', status: 'Available', color: 'blue' },
          { name: 'Hepatitis B', status: 'Limited', color: 'yellow' },
          { name: 'Typhoid', status: 'Available', color: 'green' }
        ].map((vaccine, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-xl">💉</span>
              <div>
                <h5 className="font-semibold text-gray-900">{vaccine.name}</h5>
                <p className="text-sm text-gray-600">Recommended for adults</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              vaccine.color === 'green' ? 'bg-green-100 text-green-800' :
              vaccine.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {vaccine.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Resources Section Component
const ResourcesSection = () => (
  <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 overflow-y-auto">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">📚 Health Resources & Tips</h3>
      <p className="text-gray-600">Educational content and wellness guidance</p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      {[
        { title: "Daily Health Tips", desc: "Wellness advice for better living", icon: "💡", color: "from-yellow-500 to-orange-500" },
        { title: "Emergency Guide", desc: "First aid and emergency procedures", icon: "🚨", color: "from-red-500 to-pink-500" },
        { title: "Medical Dictionary", desc: "Health terms and definitions", icon: "📚", color: "from-blue-500 to-indigo-500" },
        { title: "Nutrition Guide", desc: "Healthy eating recommendations", icon: "🥗", color: "from-green-500 to-emerald-500" },
        { title: "Exercise Plans", desc: "Fitness routines and workouts", icon: "🏃", color: "from-purple-500 to-violet-500" },
        { title: "Mental Health", desc: "Stress management and wellness", icon: "🧠", color: "from-teal-500 to-cyan-500" }
      ].map((resource, idx) => (
        <div key={idx} className={`bg-gradient-to-r ${resource.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:scale-105`}>
          <div className="text-3xl mb-3">{resource.icon}</div>
          <h4 className="font-bold text-lg mb-2">{resource.title}</h4>
          <p className="text-white/90 text-sm">{resource.desc}</p>
        </div>
      ))}
    </div>
    
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h4 className="font-bold text-gray-900 mb-4">🔥 Popular Health Articles</h4>
      <div className="space-y-4">
        {[
          { title: "10 Ways to Boost Your Immune System", time: "5 min read", views: "2.3k" },
          { title: "Understanding Diabetes: Prevention & Management", time: "8 min read", views: "1.8k" },
          { title: "Mental Health: Recognizing Signs of Depression", time: "6 min read", views: "3.1k" },
          { title: "Heart Health: Diet and Exercise Guidelines", time: "7 min read", views: "1.5k" }
        ].map((article, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <span className="text-xl">📄</span>
              <div>
                <h5 className="font-semibold text-gray-900">{article.title}</h5>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>⏱️ {article.time}</span>
                  <span>👁️ {article.views} views</span>
                </div>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Profile Section Component
const ProfileSection = ({ currentUser }) => (
  <div className="h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl p-6 overflow-y-auto">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">👤 My Profile & Settings</h3>
      <p className="text-gray-600">Manage your account and preferences</p>
    </div>
    
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {currentUser?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <h4 className="text-xl font-bold text-gray-900">{currentUser?.name}</h4>
          <p className="text-gray-600">{currentUser?.email}</p>
          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mt-2">
            ✅ Verified Account
          </span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">📧 Email Address</label>
          <input 
            type="email" 
            value={currentUser?.email || ''} 
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">📱 Phone Number</label>
          <input 
            type="tel" 
            value={currentUser?.phone || ''} 
            placeholder="+91 XXXXX XXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">🎂 Age</label>
          <input 
            type="number" 
            value={currentUser?.age || ''} 
            placeholder="Enter your age"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Location</label>
          <input 
            type="text" 
            value={currentUser?.location || ''} 
            placeholder="City, State"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="mt-6 flex space-x-4">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
          💾 Update Profile
        </button>
        <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200">
          🔒 Change Password
        </button>
      </div>
    </div>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-bold text-gray-900 mb-4">📊 Health Stats</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">💬 Total Consultations</span>
            <span className="font-bold text-blue-600">24</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">📅 Member Since</span>
            <span className="font-bold text-green-600">Jan 2024</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">⭐ Health Score</span>
            <span className="font-bold text-purple-600">85/100</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="font-bold text-gray-900 mb-4">⚙️ Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">🔔 Notifications</span>
            <button className="bg-green-500 w-12 h-6 rounded-full relative">
              <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">📧 Email Updates</span>
            <button className="bg-green-500 w-12 h-6 rounded-full relative">
              <div className="bg-white w-5 h-5 rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">🌙 Dark Mode</span>
            <button className="bg-gray-300 w-12 h-6 rounded-full relative">
              <div className="bg-white w-5 h-5 rounded-full absolute left-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NewUserDashboard;