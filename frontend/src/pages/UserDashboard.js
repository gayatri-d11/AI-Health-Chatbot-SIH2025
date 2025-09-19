import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import HealthQuiz from '../components/HealthQuiz';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [userProfile, setUserProfile] = useState(null);
  const [healthAlerts, setHealthAlerts] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [currentUser, navigate]);

  const fetchUserData = async () => {
    try {
      const [profileRes, alertsRes, chatRes] = await Promise.all([
        fetch(`http://localhost:9000/api/users/profile/${currentUser._id}`),
        fetch(`http://localhost:9000/api/users/alerts/${currentUser.location || 'All India'}`),
        fetch(`http://localhost:9000/api/users/chat-history/${currentUser._id}`)
      ]);
      
      const profileData = await profileRes.json();
      const alertsData = await alertsRes.json();
      const chatData = await chatRes.json();
      
      setUserProfile(profileData);
      setHealthAlerts(alertsData);
      setChatHistory(chatData.messages || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-semibold text-gray-900">🩺 Dr. AI HealthBot</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-teal-600 font-semibold text-sm">
                    {currentUser?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="ml-2 text-gray-700 font-medium">{currentUser?.name}</span>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section - Chat Focused */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">🩺 Dr. AI Health Assistant</h1>
              <p className="text-teal-100">Ask me anything about your health - I'm here 24/7 to help!</p>
            </div>
            <div className="flex items-center bg-teal-600 px-4 py-2 rounded-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">AI Online</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{userProfile?.totalChats || 0}</h3>
                <p className="text-gray-600">Total Chats</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div 
            onClick={() => navigate('/vaccination-centers')}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vaccination</h3>
                <p className="text-gray-600">Find Centers</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{healthAlerts.length}</h3>
                <p className="text-gray-600">Health Alerts</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Active</h3>
                <p className="text-gray-600">Status</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Vaccination Quick Access */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center">
                💉 Vaccination Information
              </h2>
              <p className="text-green-100 mb-4">Find vaccination centers, check availability, and book appointments</p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => navigate('/vaccination-centers')}
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
                >
                  Find Centers Near Me
                </button>
                <a 
                  href="https://cowin.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
                >
                  CoWIN Portal
                </a>
                <a 
                  href="tel:1075" 
                  className="bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors"
                >
                  Call 1075
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Health Alerts */}
        {healthAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Health Alerts for Your Area
            </h3>
            <div className="space-y-3">
              {healthAlerts.slice(0, 3).map((alert) => (
                <div key={alert._id} className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-red-800">{alert.disease}</h4>
                      <p className="text-red-600 text-sm mt-1">{alert.message}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'chat', label: '🩺 AI Chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { id: 'overview', label: 'Dashboard', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { id: 'quiz', label: 'Health Quiz', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
                { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Health Overview
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-4">Recent Health Tips</h4>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Drink 8 glasses of water daily
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Exercise for 30 minutes daily
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        Get 7-8 hours of sleep
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setActiveTab('chat')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-left"
                      >
                        💬 Chat with Dr. AI
                      </button>
                      <button 
                        onClick={() => navigate('/vaccination-centers')}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-left"
                      >
                        💉 Find Vaccination Centers
                      </button>
                      <button 
                        onClick={() => setActiveTab('quiz')}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-left"
                      >
                        🧠 Take Health Quiz
                      </button>
                      <a href="tel:108" className="block w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-left">
                        🚨 Emergency: Call 108
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Recent Chat History */}
                {chatHistory.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">Recent Conversations</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {chatHistory.slice(-5).map((msg, index) => (
                        <div key={index} className={`p-3 rounded-lg ${
                          msg.type === 'user' ? 'bg-blue-100 ml-8' : 'bg-white mr-8'
                        }`}>
                          <div className="text-xs text-gray-500 mb-1">
                            {msg.type === 'user' ? 'You' : 'Dr. AI'} - {new Date(msg.timestamp).toLocaleString()}
                          </div>
                          <div className="text-sm">{msg.text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && <ChatInterface />}
            {activeTab === 'quiz' && <HealthQuiz />}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold flex items-center">
                  <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Settings
                </h3>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input 
                        type="text" 
                        value={currentUser?.name || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input 
                        type="email" 
                        value={currentUser?.email || ''} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input 
                        type="tel" 
                        value={currentUser?.phone || ''}
                        placeholder="Add phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                      <input 
                        type="number" 
                        value={currentUser?.age || ''}
                        placeholder="Enter age"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input 
                        type="text" 
                        value={currentUser?.location || ''}
                        placeholder="City, State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  {currentUser?.medicalConditions?.length > 0 && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                      <div className="flex flex-wrap gap-2">
                        {currentUser.medicalConditions.map((condition, index) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;