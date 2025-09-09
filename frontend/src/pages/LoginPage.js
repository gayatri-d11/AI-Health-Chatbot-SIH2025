import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const demoLogin = async (type) => {
    setLoading(true);
    const credentials = type === 'admin' 
      ? { email: 'admin@demo.com', password: 'admin123' }
      : { email: 'user@demo.com', password: 'demo123' };
    
    const result = await login(credentials.email, credentials.password);
    
    if (result.success) {
      navigate(type === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError('Demo login failed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🩺</span>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dr. AI HealthBot
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="mt-2 text-gray-600">Sign in to access your health dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Logins */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => demoLogin('user')}
                disabled={loading}
                className="bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                👤 User Demo
              </button>
              <button
                onClick={() => demoLogin('admin')}
                disabled={loading}
                className="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                👑 Admin Demo
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up for free
              </Link>
            </p>
            <Link to="/" className="block text-sm text-gray-500 hover:text-gray-700">
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-3">🚀 What you'll get:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              24/7 AI Health Assistant
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Multilingual Support (10+ Languages)
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Personalized Health Insights
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Real-time Health Alerts
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;