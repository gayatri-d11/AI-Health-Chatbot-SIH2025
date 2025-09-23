import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EnhancedLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoCredentials, setDemoCredentials] = useState(null);
  
  const { login, getDemoCredentials } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDemoCredentials();
  }, []);

  const fetchDemoCredentials = async () => {
    const credentials = await getDemoCredentials();
    setDemoCredentials(credentials);
  };

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

    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (type) => {
    if (!demoCredentials) return;
    
    const credentials = demoCredentials[type];
    setFormData({
      email: credentials.email,
      password: credentials.password
    });
    
    try {
      setLoading(true);
      const user = await login(credentials.email, credentials.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-prussian rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">Sign in to your health assistant account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-prussian focus:ring-prussian border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="text-prussian hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-prussian text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Credentials Section */}
            {demoCredentials && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Demo Accounts</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleDemoLogin('user')}
                    disabled={loading}
                    className="w-full bg-palm text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all text-sm"
                  >
                    Demo User Login
                  </button>
                  <button
                    onClick={() => handleDemoLogin('admin')}
                    disabled={loading}
                    className="w-full bg-steel text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all text-sm"
                  >
                    Demo Admin Login
                  </button>
                </div>
                <div className="mt-3 text-xs text-gray-500 text-center">
                  <p>User: {demoCredentials.user?.email}</p>
                  <p>Admin: {demoCredentials.admin?.email}</p>
                </div>
              </div>
            )}

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-prussian hover:underline font-medium">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-prussian to-steel text-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">AI Health Assistant</h3>
          <p className="text-lg opacity-90 mb-8">
            Get instant medical consultation in your preferred language. 
            Available 24/7 for your healthcare needs.
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <svg className="w-5 h-5 opacity-80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="opacity-90">10+ Indian Languages</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 opacity-80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="opacity-90">24/7 Availability</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 opacity-80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="opacity-90">Emergency Support</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 opacity-80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="opacity-90">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginPage;