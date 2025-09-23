import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminLoginPage = () => {
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

    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Admin credentials required.');
      }
    } catch (error) {
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const user = await login('admin@healthcareai.com', 'admin123');
      navigate('/admin');
    } catch (error) {
      setError('Demo admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-prussian rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white">Admin Portal</h2>
          <p className="mt-3 text-slate-400">Secure access to system administration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
                placeholder="admin@healthcareai.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-prussian text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Authenticating...' : 'Access Admin Portal'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-steel text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 transition-all"
            >
              Demo Admin Login
            </button>
            <div className="mt-2 text-center text-xs text-gray-500">
              <p>Email: admin@healthcareai.com</p>
              <p>Password: admin123</p>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 mt-6">
            <Link to="/login" className="text-prussian hover:underline text-sm font-medium">
              User Login
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;