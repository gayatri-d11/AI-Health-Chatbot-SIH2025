import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser, logout, token } = useAuth();
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:8000/api';

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin-login');
    } else {
      fetchAdminData();
    }
  }, [currentUser, navigate]);

  const fetchAdminData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || {});
      }
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection stats={stats} />;
      case 'users':
        return <UserManagementSection users={users} token={token} fetchAdminData={fetchAdminData} />;
      default:
        return <OverviewSection stats={stats} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-prussian mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-white">
        <div className="p-6 bg-prussian">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Portal</h2>
              <p className="text-blue-100 text-sm">Healthcare Management</p>
            </div>
          </div>
        </div>

        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 text-left transition-all ${
                activeSection === item.id 
                  ? 'bg-prussian text-white border-r-4 border-steel' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-prussian rounded-full flex items-center justify-center text-white font-bold">
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{currentUser?.name}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.id === activeSection)?.label}
              </h1>
              <p className="text-gray-600">Healthcare platform administration</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">System Online</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const OverviewSection = ({ stats }) => (
  <div className="space-y-6">
    <div className="grid md:grid-cols-4 gap-6">
      {[
        { label: 'Total Users', value: stats.totalUsers || 0, color: 'prussian' },
        { label: 'Verified Users', value: stats.verifiedUsers || 0, color: 'palm' },
        { label: 'New This Week', value: stats.recentUsers || 0, color: 'steel' },
        { label: 'System Health', value: '99.9%', color: 'slimy' }
      ].map((stat, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 bg-${stat.color} rounded-lg flex items-center justify-center`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Activity</h3>
      <div className="space-y-3">
        {[
          { action: 'New user registration', user: 'user@example.com', time: '2 minutes ago' },
          { action: 'Admin login', user: 'admin', time: '15 minutes ago' },
          { action: 'System health check', user: 'system', time: '1 hour ago' }
        ].map((activity, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div>
              <p className="font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-600">by {activity.user}</p>
            </div>
            <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UserManagementSection = ({ users, token, fetchAdminData }) => {
  const API_BASE = 'http://localhost:8000/api';

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isVerified: !currentStatus })
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Registered Users ({users.length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Registered</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900 font-medium">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.phone}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {user.address?.city}, {user.address?.state}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.isVerified)}
                      className="text-prussian hover:text-steel text-sm font-medium"
                    >
                      {user.isVerified ? 'Suspend' : 'Verify'}
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
};

export default AdminDashboard;