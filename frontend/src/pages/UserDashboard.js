import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [healthData, setHealthData] = useState({
    lastCheckup: '2024-01-15',
    nextAppointment: '2024-02-15',
    healthScore: 85,
    bmi: 23.5,
    bloodPressure: '120/80',
    heartRate: 72
  });
  const [recentChats, setRecentChats] = useState([]);
  const [healthAlerts, setHealthAlerts] = useState([]);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Fetch user data
    fetchUserData();
  }, [currentUser, navigate]);

  const fetchUserData = async () => {
    try {
      // Simulate API calls
      setRecentChats([
        { id: 1, message: 'मुझे बुखार है', response: 'आराम करें और पानी पिएं', timestamp: '2024-01-20 10:30' },
        { id: 2, message: 'What are COVID symptoms?', response: 'Fever, cough, difficulty breathing...', timestamp: '2024-01-19 15:45' },
        { id: 3, message: 'Blood pressure tips', response: 'Regular exercise, low sodium diet...', timestamp: '2024-01-18 09:15' }
      ]);

      setHealthAlerts([
        { id: 1, type: 'vaccination', message: 'COVID booster due in 2 weeks', priority: 'medium', date: '2024-02-01' },
        { id: 2, type: 'checkup', message: 'Annual health checkup reminder', priority: 'low', date: '2024-02-15' },
        { id: 3, type: 'outbreak', message: 'Dengue cases reported in your area', priority: 'high', date: '2024-01-20' }
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🩺</span>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Dr. AI HealthBot</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="ml-2 text-gray-700">{currentUser?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Here's your health overview and recent activity</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link to="/chat" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold mb-1">Chat with Dr. AI</h3>
            <p className="text-sm opacity-90">Get instant health advice</p>
          </Link>
          
          <Link to="/quiz" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold mb-1">Health Quiz</h3>
            <p className="text-sm opacity-90">Assess your health status</p>
          </Link>
          
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold mb-1">Health Reports</h3>
            <p className="text-sm opacity-90">View your health data</p>
          </button>
          
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl hover:shadow-lg transition-all">
            <div className="text-3xl mb-2">🚨</div>
            <h3 className="font-semibold mb-1">Emergency</h3>
            <p className="text-sm opacity-90">Quick access to help</p>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'health', label: 'Health Data', icon: '🏥' },
                { id: 'chats', label: 'Recent Chats', icon: '💬' },
                { id: 'alerts', label: 'Health Alerts', icon: '🔔' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl">
                    <h3 className="font-semibold text-blue-800 mb-2">Health Score</h3>
                    <div className={`text-3xl font-bold ${getHealthScoreColor(healthData.healthScore)}`}>
                      {healthData.healthScore}%
                    </div>
                    <p className="text-sm text-blue-600 mt-1">Based on recent assessments</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-2">BMI</h3>
                    <div className="text-3xl font-bold text-green-600">{healthData.bmi}</div>
                    <p className="text-sm text-green-600 mt-1">Normal range</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl">
                    <h3 className="font-semibold text-purple-800 mb-2">Last Checkup</h3>
                    <div className="text-lg font-bold text-purple-600">{healthData.lastCheckup}</div>
                    <p className="text-sm text-purple-600 mt-1">Next: {healthData.nextAppointment}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">📈 Health Trends</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Blood Pressure</span>
                        <span className="font-semibold text-green-600">{healthData.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heart Rate</span>
                        <span className="font-semibold text-blue-600">{healthData.heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weight</span>
                        <span className="font-semibold text-purple-600">65 kg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold mb-4">🎯 Today's Goals</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Water intake</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                          </div>
                          <span className="text-sm">6/8 glasses</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Steps</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                          </div>
                          <span className="text-sm">6,000/10,000</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Sleep</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '87%'}}></div>
                          </div>
                          <span className="text-sm">7/8 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Health Data Tab */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">📊 Your Health Data</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">Vital Signs</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Blood Pressure</span>
                        <span className="font-semibold text-green-600">{healthData.bloodPressure} mmHg</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Heart Rate</span>
                        <span className="font-semibold text-blue-600">{healthData.heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Body Temperature</span>
                        <span className="font-semibold text-purple-600">98.6°F</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">Body Metrics</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>BMI</span>
                        <span className="font-semibold text-green-600">{healthData.bmi}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Weight</span>
                        <span className="font-semibold text-blue-600">65 kg</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>Height</span>
                        <span className="font-semibold text-purple-600">165 cm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-xl">
                  <h4 className="font-semibold mb-4">Health History</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Annual Checkup</span>
                        <p className="text-sm text-gray-600">Complete health screening</p>
                      </div>
                      <span className="text-sm text-gray-500">Jan 15, 2024</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">COVID Vaccination</span>
                        <p className="text-sm text-gray-600">Booster dose administered</p>
                      </div>
                      <span className="text-sm text-gray-500">Dec 10, 2023</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Blood Test</span>
                        <p className="text-sm text-gray-600">Routine blood work</p>
                      </div>
                      <span className="text-sm text-gray-500">Nov 20, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Chats Tab */}
            {activeTab === 'chats' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">💬 Recent Conversations</h3>
                  <Link to="/chat" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    New Chat
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentChats.map(chat => (
                    <div key={chat.id} className="bg-white border border-gray-200 p-4 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">You: {chat.message}</p>
                          <p className="text-gray-600 text-sm">Dr. AI: {chat.response}</p>
                        </div>
                        <span className="text-xs text-gray-500 ml-4">{chat.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Alerts Tab */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">🔔 Health Alerts & Reminders</h3>
                
                <div className="space-y-4">
                  {healthAlerts.map(alert => (
                    <div key={alert.id} className={`p-4 rounded-xl border ${getAlertColor(alert.priority)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold capitalize">{alert.type} Alert</h4>
                          <p className="mt-1">{alert.message}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm">{alert.date}</span>
                          <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                            alert.priority === 'high' ? 'bg-red-200' :
                            alert.priority === 'medium' ? 'bg-yellow-200' : 'bg-blue-200'
                          }`}>
                            {alert.priority} priority
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">⚙️ Account Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">Profile Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input 
                          type="text" 
                          value={currentUser?.name || ''} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          value={currentUser?.email || ''} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="en">English</option>
                          <option value="hi">Hindi (हिंदी)</option>
                          <option value="te">Telugu (తెలుగు)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">Notification Preferences</h4>
                    <div className="space-y-4">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Health alerts via email</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Vaccination reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" />
                        <span>Weekly health reports</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3" defaultChecked />
                        <span>Emergency alerts</span>
                      </label>
                    </div>
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