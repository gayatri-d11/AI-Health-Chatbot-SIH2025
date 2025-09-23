import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const EnhancedRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    allergies: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    preferredLanguage: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const languages = [
    'English', 'Hindi', 'Telugu', 'Tamil', 'Bengali', 
    'Gujarati', 'Marathi', 'Punjabi', 'Kannada', 'Malayalam'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
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

    try {
      const registrationData = {
        ...formData,
        allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a)
      };
      delete registrationData.confirmPassword;

      await register(registrationData);
      alert('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <input
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Create password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
          <input
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Confirm password"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
          <select
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input
            name="age"
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Enter age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            name="address.street"
            type="text"
            value={formData.address.street}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Street Address"
          />
          <input
            name="address.city"
            type="text"
            value={formData.address.city}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="City"
          />
          <input
            name="address.state"
            type="text"
            value={formData.address.state}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="State"
          />
          <input
            name="address.pincode"
            type="text"
            value={formData.address.pincode}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Pincode"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Allergies (comma separated)</label>
        <input
          name="allergies"
          type="text"
          value={formData.allergies}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
          placeholder="e.g., Peanuts, Shellfish, Penicillin"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
          <input
            name="emergencyContact.name"
            type="text"
            value={formData.emergencyContact.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="Emergency contact name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
          <input
            name="emergencyContact.phone"
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
        <input
          name="emergencyContact.relation"
          type="text"
          value={formData.emergencyContact.relation}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-prussian focus:border-transparent"
          placeholder="e.g., Father, Mother, Spouse, Friend"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="whatsapp-consent"
            className="h-4 w-4 text-prussian focus:ring-prussian border-gray-300 rounded"
            defaultChecked
          />
          <label htmlFor="whatsapp-consent" className="ml-2 block text-sm text-gray-700">
            I consent to receive health updates and notifications via WhatsApp
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-prussian rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Your Health Account</h2>
          <p className="mt-2 text-gray-600">Step {step} of 3 - Complete your registration</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-prussian h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-prussian text-white rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-prussian text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-prussian hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRegisterPage;