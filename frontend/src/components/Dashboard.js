import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = ({ userProfile, setUserProfile }) => {
  const [formData, setFormData] = useState({
    phone: userProfile?.phone || '',
    name: userProfile?.name || '',
    age: userProfile?.age || '',
    location: userProfile?.location || '',
    language: userProfile?.language || 'hi'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users/profile', formData);
      setUserProfile(response.data.user);
      localStorage.setItem('userProfile', JSON.stringify(response.data.user));
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">User Profile | उपयोगकर्ता प्रोफ़ाइल</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Name | नाम</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Age | आयु</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location | स्थान</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Preferred Language</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({...formData, language: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="hi">हिंदी</option>
            <option value="en">English</option>
            <option value="te">తెలుగు</option>
            <option value="ta">தமிழ்</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Update Profile | प्रोफ़ाइल अपडेट करें
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
