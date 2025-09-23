import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NewLoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 
    'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Malayalam'
  ];

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
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-health-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-slate-600">Sign in to your health assistant account</p>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-selector focus-ring"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-health-600 focus:ring-health-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="text-health-600 hover:text-health-700 font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-white py-3 px-4 rounded-lg font-medium focus-ring disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-health-600 hover:text-health-700 font-medium">
                  Create account
                </Link>
              </p>
            </div>

            <div className="text-center">
              <Link 
                to="/admin-login" 
                className="text-sm text-slate-500 hover:text-slate-700 font-medium"
              >
                Admin Portal
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-health-600 to-medical-600 text-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">AI Health Assistant</h3>
          <p className="text-lg text-white/90 mb-8">
            Get instant medical consultation in your preferred language. 
            Available 24/7 for your healthcare needs.
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">10+ Indian Languages</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">24/7 Availability</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Emergency Support</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/90">Secure & Private</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLoginPage;