import React, { useState } from 'react';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    location: user?.location || '',
    language: user?.language || 'hi',
    medicalConditions: user?.medicalConditions || []
  });
  const [loading, setLoading] = useState(false);

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
        medicalConditions: [...formData.medicalConditions, condition]
      });
    }
  };

  const removeMedicalCondition = (index) => {
    setFormData({
      ...formData,
      medicalConditions: formData.medicalConditions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        {!isEditing ? (
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mt-1">
                  Active User
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user?.age || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{user?.location || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {user?.language === 'hi' ? 'हिंदी' : 
                   user?.language === 'en' ? 'English' :
                   user?.language === 'te' ? 'తెలుగు' :
                   user?.language === 'ta' ? 'தமிழ்' :
                   user?.language === 'bn' ? 'বাংলা' : 'Hindi'}
                </p>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Medical Conditions</label>
              {formData.medicalConditions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.medicalConditions.map((condition, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      {condition}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No medical conditions recorded</p>
              )}
            </div>

            {/* Account Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <div className="text-sm text-blue-700">Chat Sessions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">850</div>
                  <div className="text-sm text-green-700">Quiz Points</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">15</div>
                  <div className="text-sm text-purple-700">Days Active</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
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
                  Email Address
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
                  Phone Number
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
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Language
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="hi">हिंदी</option>
                  <option value="en">English</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                <button
                  type="button"
                  onClick={addMedicalCondition}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Add Condition
                </button>
              </div>
              {formData.medicalConditions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.medicalConditions.map((condition, index) => (
                    <span key={index} className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full flex items-center">
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
    </div>
  );
};

export default UserProfile;