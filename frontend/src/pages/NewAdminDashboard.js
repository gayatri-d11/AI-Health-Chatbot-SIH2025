import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'users',
      label: 'User Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    {
      id: 'alerts',
      label: 'Health Alerts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      id: 'vaccination',
      label: 'Vaccination Management',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
        </svg>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin-login');
    } else {
      fetchAdminData();
    }
  }, [currentUser, navigate]);

  const fetchAdminData = async () => {
    try {
      // Fetch admin dashboard data
      const [usersRes, alertsRes, statsRes] = await Promise.all([
        fetch('http://localhost:8000/api/admin/users'),
        fetch('http://localhost:8000/api/admin/alerts'),
        fetch('http://localhost:8000/api/admin/stats')
      ]);
      
      if (usersRes.ok) setUsers(await usersRes.json());
      if (alertsRes.ok) setAlerts(await alertsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection stats={stats} />;
      case 'users':
        return <UserManagementSection users={users} setUsers={setUsers} />;
      case 'alerts':
        return <AlertManagementSection alerts={alerts} setAlerts={setAlerts} />;
      case 'vaccination':
        return <VaccinationManagementSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <OverviewSection stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-900 text-white transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 bg-health-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              {sidebarOpen && (
                <span className="ml-3 text-lg font-semibold">Admin Portal</span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-slate-800 focus-ring"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 focus-ring ${
                activeSection === item.id 
                  ? 'bg-health-600 text-white border-r-3 border-health-400' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Admin Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-health-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {currentUser?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white focus-ring rounded-lg"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white focus-ring rounded-lg"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {sidebarItems.find(item => item.id === activeSection)?.label}
                </h1>
                <p className="text-slate-600">Healthcare platform administration</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-medical-500 rounded-full status-online"></div>
                  <span className="text-sm text-slate-600">System Online</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection = ({ stats }) => (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid md:grid-cols-4 gap-6">
      {[
        { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'health' },
        { label: 'Active Sessions', value: stats.activeSessions || 0, icon: '💬', color: 'medical' },
        { label: 'Health Alerts', value: stats.totalAlerts || 0, icon: '🚨', color: 'care' },
        { label: 'System Uptime', value: '99.9%', icon: '⚡', color: 'health' }
      ].map((stat, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent System Activity</h3>
      <div className="space-y-3">
        {[
          { action: 'New user registration', user: 'user@example.com', time: '2 minutes ago' },
          { action: 'Health alert created', user: 'admin', time: '15 minutes ago' },
          { action: 'System backup completed', user: 'system', time: '1 hour ago' }
        ].map((activity, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
            <div>
              <p className="font-medium text-slate-900">{activity.action}</p>
              <p className="text-sm text-slate-600">by {activity.user}</p>
            </div>
            <span className="text-sm text-slate-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// User Management Section Component
const UserManagementSection = ({ users, setUsers }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">User Management</h3>
        <button className="btn-primary text-white px-4 py-2 rounded-lg font-medium">
          Add New User
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-900">Name</th>
              <th className="text-left py-3 px-4 font-medium text-slate-900">Email</th>
              <th className="text-left py-3 px-4 font-medium text-slate-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 10).map((user, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-3 px-4 text-slate-900">{user.name}</td>
                <td className="py-3 px-4 text-slate-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-medical-100 text-medical-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-health-600 hover:text-health-700 text-sm font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Alert Management Section Component
const AlertManagementSection = ({ alerts, setAlerts }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Health Alert Management</h3>
        <button className="btn-primary text-white px-4 py-2 rounded-lg font-medium">
          Create New Alert
        </button>
      </div>
      
      <div className="space-y-4">
        {alerts.slice(0, 5).map((alert, idx) => (
          <div key={idx} className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">{alert.title}</h4>
                <p className="text-slate-600 text-sm mt-1">{alert.message}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-care-100 text-care-800' :
                  'bg-medical-100 text-medical-800'
                }`}>
                  {alert.severity}
                </span>
                <button className="text-health-600 hover:text-health-700 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Vaccination Management Section Component
const VaccinationManagementSection = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Vaccination Management</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-medical-50 p-4 rounded-lg">
          <h4 className="font-medium text-medical-800 mb-2">Center Management</h4>
          <p className="text-medical-700 text-sm mb-4">Manage vaccination centers and availability</p>
          <button className="btn-secondary text-white px-4 py-2 rounded-lg font-medium">
            Manage Centers
          </button>
        </div>
        
        <div className="bg-health-50 p-4 rounded-lg">
          <h4 className="font-medium text-health-800 mb-2">Notification System</h4>
          <p className="text-health-700 text-sm mb-4">Send vaccination reminders to users</p>
          <button className="btn-primary text-white px-4 py-2 rounded-lg font-medium">
            Send Notifications
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Analytics Section Component
const AnalyticsSection = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">System Analytics</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "User Engagement", value: "85%", trend: "up" },
          { title: "Response Time", value: "1.2s", trend: "down" },
          { title: "Success Rate", value: "98.5%", trend: "up" }
        ].map((metric, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-900 mb-2">{metric.title}</h4>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
              <span className={`text-sm ${metric.trend === 'up' ? 'text-medical-600' : 'text-health-600'}`}>
                {metric.trend === 'up' ? '↗' : '↘'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Settings Section Component
const SettingsSection = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">System Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-slate-200">
          <div>
            <h4 className="font-medium text-slate-900">AI Response Settings</h4>
            <p className="text-slate-600 text-sm">Configure AI model parameters</p>
          </div>
          <button className="text-health-600 hover:text-health-700 font-medium">Configure</button>
        </div>
        
        <div className="flex items-center justify-between py-3 border-b border-slate-200">
          <div>
            <h4 className="font-medium text-slate-900">Language Support</h4>
            <p className="text-slate-600 text-sm">Manage supported languages</p>
          </div>
          <button className="text-health-600 hover:text-health-700 font-medium">Manage</button>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <div>
            <h4 className="font-medium text-slate-900">System Backup</h4>
            <p className="text-slate-600 text-sm">Configure automatic backups</p>
          </div>
          <button className="text-health-600 hover:text-health-700 font-medium">Configure</button>
        </div>
      </div>
    </div>
  </div>
);

export default NewAdminDashboard;