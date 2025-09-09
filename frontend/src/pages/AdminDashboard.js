import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeChats: 45,
    healthAlerts: 12,
    systemStatus: 'operational'
  });
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">👑</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Admin Portal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">A</span>
                </div>
                <span className="ml-2 text-gray-700">Admin</span>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            <p className="opacity-90">Total Users</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-2xl font-bold">{stats.activeChats}</h3>
            <p className="opacity-90">Active Chats</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
            <div className="text-3xl mb-2">🚨</div>
            <h3 className="text-2xl font-bold">{stats.healthAlerts}</h3>
            <p className="opacity-90">Health Alerts</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-2xl font-bold">99.9%</h3>
            <p className="opacity-90">Uptime</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'users', label: 'Users', icon: '👥' },
                { id: 'chats', label: 'Chat Logs', icon: '💬' },
                { id: 'alerts', label: 'Alerts', icon: '🔔' },
                { id: 'settings', label: 'Settings', icon: '⚙️' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">System Overview</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>New user registrations</span>
                        <span className="font-semibold text-green-600">+25 today</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chat sessions</span>
                        <span className="font-semibold text-blue-600">342 today</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Health alerts sent</span>
                        <span className="font-semibold text-orange-600">12 today</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">System Health</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>API Response Time</span>
                        <span className="font-semibold text-green-600">1.2s avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>AI Accuracy</span>
                        <span className="font-semibold text-green-600">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Server Load</span>
                        <span className="font-semibold text-yellow-600">65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">User Management</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">D</span>
                            </div>
                            <span className="ml-3">Demo User</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">user@demo.com</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Chat Monitoring</h3>
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium">User: मुझे बुखार है</span>
                        <p className="text-sm text-gray-600">AI: आराम करें और पानी पिएं...</p>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Health Alert Management</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create New Alert</button>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                    <h4 className="font-semibold text-red-800">High Priority Alert</h4>
                    <p className="text-red-600">Dengue outbreak reported in Mumbai</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">System Settings</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">AI Configuration</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Response Language</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>Auto-detect</option>
                          <option>English</option>
                          <option>Hindi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>Gemini 1.5 Flash</option>
                          <option>Gemini Pro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-semibold mb-4">System Maintenance</h4>
                    <div className="space-y-4">
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg">Backup Database</button>
                      <button className="w-full bg-yellow-600 text-white py-2 rounded-lg">Clear Chat Logs</button>
                      <button className="w-full bg-red-600 text-white py-2 rounded-lg">System Restart</button>
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

export default AdminDashboard;