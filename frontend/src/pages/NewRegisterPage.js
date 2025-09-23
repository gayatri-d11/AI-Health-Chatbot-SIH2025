import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NewRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    location: '',
    emergencyContact: '',
    preferredLanguage: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [] });
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 
    'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Malayalam'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    const feedback = [];
    
    if (!checks.length) feedback.push('At least 8 characters');
    if (!checks.uppercase) feedback.push('One uppercase letter');
    if (!checks.lowercase) feedback.push('One lowercase letter');
    if (!checks.number) feedback.push('One number');
    if (!checks.special) feedback.push('One special character');
    
    return { score, feedback, checks };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength.score < 3) {
      setError('Password is too weak. Please follow the requirements.');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Side - Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-medical-600 to-health-600 text-white items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
          <p className="text-lg text-white/90 mb-8">
            Access professional healthcare assistance in your native language. 
            Start your journey to better health today.
          </p>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-white/90">Instant AI Consultation</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-white/90">Multi-Channel Access</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white/90">Health Assessments</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-white/80 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-white/90">Real-time Alerts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-medical-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="mt-2 text-slate-600">Join our healthcare platform today</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
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
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Create strong password"
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded ${
                            level <= passwordStrength.score
                              ? passwordStrength.score <= 2
                                ? 'bg-red-400'
                                : passwordStrength.score <= 3
                                ? 'bg-yellow-400'
                                : 'bg-green-400'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-600">
                      <span className="font-medium">
                        {passwordStrength.score <= 2 ? 'Weak' : passwordStrength.score <= 3 ? 'Fair' : 'Strong'}
                      </span>
                      {passwordStrength.feedback.length > 0 && (
                        <span className="ml-2">Missing: {passwordStrength.feedback.join(', ')}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Confirm password"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="bloodGroup" className="block text-sm font-medium text-slate-700 mb-2">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-slate-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="tel"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="preferredLanguage" className="block text-sm font-medium text-slate-700 mb-2">
                Preferred Language
              </label>
              <select
                id="preferredLanguage"
                name="preferredLanguage"
                value={formData.preferredLanguage}
                onChange={handleChange}
                className="form-input w-full px-4 py-3 rounded-lg border border-slate-300 focus-ring"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-medical-600 focus:ring-medical-500 border-slate-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                I agree to the{' '}
                <Link to="/terms" className="text-medical-600 hover:text-medical-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-medical-600 hover:text-medical-700 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || passwordStrength.score < 3}
              className="w-full btn-secondary text-white py-3 px-4 rounded-lg font-medium focus-ring disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <p className="text-xs text-slate-500 text-center">
              Fields marked with <span className="text-red-500">*</span> are required
            </p>

            <div className="text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-medical-600 hover:text-medical-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewRegisterPage;