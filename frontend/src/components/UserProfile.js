import React, { useState, useEffect } from 'react';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    location: user?.address || '',
    emergencyContact: user?.emergencyContact?.phone || '',
    preferredLanguage: user?.preferredLanguage || 'English',
    allergies: user?.allergies || [],
    medicalHistory: user?.medicalHistory || [],
    currentMedications: user?.currentMedications || [],
    chronicConditions: user?.chronicConditions || []
  });
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    calculateProfileCompletion();
  }, [user]);

  const calculateProfileCompletion = () => {
    const fields = ['name', 'email', 'phone', 'age', 'gender', 'bloodGroup', 'location', 'emergencyContact'];
    const filledFields = fields.filter(field => {
      if (field === 'location') return user?.address;
      if (field === 'emergencyContact') return user?.emergencyContact?.phone;
      return user?.[field];
    });
    setProfileCompletion(Math.round((filledFields.length / fields.length) * 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addMedicalCondition = () => {
    const condition = prompt('Enter medical condition:');
    if (condition) {
      setFormData({
        ...formData,
        medicalHistory: [...(formData.medicalHistory || []), condition]
      });
    }
  };

  const removeMedicalCondition = (index) => {
    setFormData({
      ...formData,
      medicalHistory: formData.medicalHistory.filter((_, i) => i !== index)
    });
  };

  const addAllergy = () => {
    const allergy = prompt('Enter allergy:');
    if (allergy) {
      setFormData({
        ...formData,
        allergies: [...(formData.allergies || []), allergy]
      });
    }
  };

  const removeAllergy = (index) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index)
    });
  };

  const addMedication = () => {
    const medication = prompt('Enter current medication:');
    if (medication) {
      setFormData({
        ...formData,
        currentMedications: [...(formData.currentMedications || []), medication]
      });
    }
  };

  const removeMedication = (index) => {
    setFormData({
      ...formData,
      currentMedications: formData.currentMedications.filter((_, i) => i !== index)
    });
  };

  const handleHealthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/users/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          allergies: formData.allergies,
          medicalHistory: formData.medicalHistory,
          currentMedications: formData.currentMedications,
          chronicConditions: formData.chronicConditions
        })
      });

      if (response.ok) {
        setIsEditingHealth(false);
        alert('Health data updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update health data:', error);
      alert('Failed to update health data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (profileCompletion >= 80) return 'text-green-600 bg-green-100';
    if (profileCompletion >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusText = () => {
    if (profileCompletion >= 80) return 'Complete Profile';
    if (profileCompletion >= 50) return 'Partial Profile';
    return 'Incomplete Profile';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {profileCompletion}% Complete
                  </span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Profile Completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', name: 'Personal Info', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { id: 'health', name: 'Health Data', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              { id: 'security', name: 'Security', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { id: 'activity', name: 'Activity', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                </svg>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                            <p className="text-gray-900 font-medium">{user?.name || 'Not provided'}</p>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                            <p className="text-gray-900 font-medium break-all">{user?.email || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                            <p className="text-gray-900 font-medium">{user?.phone || 'Not provided'}</p>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                            <p className="text-gray-900 font-medium">{user?.age ? `${user.age} years` : 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                            <p className="text-gray-900 font-medium capitalize">{user?.gender || 'Not provided'}</p>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Blood Group</label>
                            <p className="text-gray-900 font-medium">{user?.bloodGroup || 'Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Location Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Contact & Location
                      </h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Location/Address</label>
                            <p className="text-gray-900 font-medium">
                              {user?.address?.city || 
                               (typeof user?.address === 'string' ? user.address : 'Not provided')}
                            </p>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                            <p className="text-gray-900 font-medium">
                              {user?.emergencyContact?.phone || 
                               (typeof user?.emergencyContact === 'string' ? user.emergencyContact : 'Not provided')}
                            </p>
                            {user?.emergencyContact?.name && (
                              <p className="text-gray-600 text-sm mt-1">
                                {user.emergencyContact.name} ({user.emergencyContact.relation})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Preferences & Settings
                      </h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Preferred Language</label>
                            <p className="text-gray-900 font-medium">{user?.preferredLanguage || 'English'}</p>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Account Role</label>
                            <p className="text-gray-900 font-medium capitalize">{user?.role || 'User'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Account Information Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Account Information
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Registration Date</label>
                            <p className="text-gray-900 font-medium">
                              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'Not available'}
                            </p>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Account Status</label>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <p className="text-gray-900 font-medium">
                                {user?.isVerified ? 'Verified' : 'Pending Verification'}
                              </p>
                            </div>
                          </div>
                          <div className="p-4">
                            <label className="block text-sm font-medium text-gray-500 mb-1">Last Login</label>
                            <p className="text-gray-900 font-medium">
                              {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'First time login'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Contact & Location</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location/Address
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Emergency contact phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Preferences</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferredLanguage" className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Language
                  </label>
                  <select
                    id="preferredLanguage"
                    name="preferredLanguage"
                    value={formData.preferredLanguage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                    <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="Malayalam">മലയാളം (Malayalam)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Medical Information</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                    <button
                      type="button"
                      onClick={addMedicalCondition}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Add Condition</span>
                    </button>
                  </div>
                  {formData.medicalHistory && formData.medicalHistory.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.medicalHistory.map((condition, index) => (
                        <span key={index} className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-1 rounded-full flex items-center">
                          {condition}
                          <button
                            type="button"
                            onClick={() => removeMedicalCondition(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
              </form>
              )}
            </div>
          )}
          
          {activeTab === 'health' && (
            <div className="space-y-6">
              {!isEditingHealth ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Health Data</h3>
                    <button
                      onClick={() => setIsEditingHealth(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Health Data</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Allergies</h4>
                      {user?.allergies?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {user.allergies.map((allergy, index) => (
                            <span key={index} className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-1 rounded-full">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No allergies recorded</p>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Current Medications</h4>
                      {user?.currentMedications?.length > 0 ? (
                        <div className="space-y-2">
                          {user.currentMedications.map((medication, index) => (
                            <div key={index} className="bg-blue-50 border border-blue-200 p-2 rounded text-sm">
                              {medication}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No current medications</p>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Medical History</h4>
                      {user?.medicalHistory?.length > 0 ? (
                        <div className="space-y-2">
                          {user.medicalHistory.map((condition, index) => (
                            <div key={index} className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm">
                              {typeof condition === 'string' ? condition : condition.condition}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No medical history recorded</p>
                      )}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Chronic Conditions</h4>
                      {user?.chronicConditions?.length > 0 ? (
                        <div className="space-y-2">
                          {user.chronicConditions.map((condition, index) => (
                            <div key={index} className="bg-orange-50 border border-orange-200 p-2 rounded text-sm">
                              {condition}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No chronic conditions recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleHealthSubmit} className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Health Data</h3>
                  </div>
                  
                  {/* Allergies */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-semibold text-gray-900">Allergies</h4>
                      <button
                        type="button"
                        onClick={addAllergy}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Allergy</span>
                      </button>
                    </div>
                    {formData.allergies && formData.allergies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.allergies.map((allergy, index) => (
                          <span key={index} className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-1 rounded-full flex items-center">
                            {allergy}
                            <button
                              type="button"
                              onClick={() => removeAllergy(index)}
                              className="ml-2 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Current Medications */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-semibold text-gray-900">Current Medications</h4>
                      <button
                        type="button"
                        onClick={addMedication}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Medication</span>
                      </button>
                    </div>
                    {formData.currentMedications && formData.currentMedications.length > 0 && (
                      <div className="space-y-2">
                        {formData.currentMedications.map((medication, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 p-2 rounded text-sm flex items-center justify-between">
                            {medication}
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Medical History */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-md font-semibold text-gray-900">Medical History</h4>
                      <button
                        type="button"
                        onClick={addMedicalCondition}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Condition</span>
                      </button>
                    </div>
                    {formData.medicalHistory && formData.medicalHistory.length > 0 && (
                      <div className="space-y-2">
                        {formData.medicalHistory.map((condition, index) => (
                          <div key={index} className="bg-yellow-50 border border-yellow-200 p-2 rounded text-sm flex items-center justify-between">
                            {condition}
                            <button
                              type="button"
                              onClick={() => removeMedicalCondition(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditingHealth(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Health Data'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Security</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Email Verification</p>
                      <p className="text-sm text-gray-600">Your email address is verified</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Last Login</p>
                      <p className="text-sm text-gray-600">
                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN') : 'Never'}
                      </p>
                    </div>
                  </div>
                  
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-blue-600">{user?.chatHistory?.length || 0}</p>
                      <p className="text-blue-700 font-medium">Chat Sessions</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-green-600">85%</p>
                      <p className="text-green-700 font-medium">Health Score</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-2xl font-bold text-purple-600">
                        {user?.createdAt ? Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
                      </p>
                      <p className="text-purple-700 font-medium">Days Active</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-gray-700">Profile updated successfully</p>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-gray-700">Completed health assessment</p>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-gray-700">Started new chat session</p>
                    <span className="text-sm text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
