import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VaccinationPage = () => {
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [vaccinationData, setVaccinationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [schedules, setSchedules] = useState([]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    vaccineName: '',
    date: '',
    time: '',
    center: '',
    notes: ''
  });

  useEffect(() => {
    // Set default date to today
    const today = new Date();
    const formattedDate = formatDateForAPI(today);
    setSelectedDate(formattedDate);
  }, []);

  const formatDateForAPI = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: formatDateForAPI(date),
        display: date.toLocaleDateString('en-IN', { 
          weekday: 'short', 
          day: 'numeric', 
          month: 'short' 
        }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const searchVaccination = () => {
    // Redirect to CoWIN website
    window.open('https://www.cowin.gov.in/home', '_blank');
  };

  const addSchedule = () => {
    if (!newSchedule.vaccineName || !newSchedule.date || !newSchedule.time) {
      alert('Please fill in all required fields');
      return;
    }
    
    const schedule = {
      id: Date.now(),
      ...newSchedule,
      status: 'Scheduled'
    };
    
    setSchedules([...schedules, schedule]);
    setNewSchedule({
      vaccineName: '',
      date: '',
      time: '',
      center: '',
      notes: ''
    });
    setShowAddSchedule(false);
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">💉 Vaccination Centers</h1>
                  <p className="text-sm text-gray-600">Find vaccination centers near you</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://cowin.gov.in" target="_blank" rel="noopener noreferrer" 
                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                CoWIN Portal
              </a>
              <a href="tel:1075" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                📞 1075
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'search' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🔍 Find Centers
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'info' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ℹ️ Vaccination Info
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'schedule' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📅 Schedule
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Professional Search Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Find Vaccination Centers</h2>
                  <p className="text-sm text-gray-600 mt-1">Search for vaccination centers in your area</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-600">Location Services</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (District/Pincode)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter district name or pincode"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={searchVaccination}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Find Centers on CoWIN
                </button>
                <a
                  href="tel:1075"
                  className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-medium"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 1075
                </a>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Free Vaccination</h3>
                </div>
                <p className="text-gray-600 text-sm">All vaccines are provided free of cost at government vaccination centers across India.</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">24/7 Support</h3>
                </div>
                <p className="text-gray-600 text-sm">Get help anytime by calling the national helpline 1075 for vaccination-related queries.</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">Digital Certificate</h3>
                </div>
                <p className="text-gray-600 text-sm">Download your vaccination certificate instantly from CoWIN portal after vaccination.</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">💉 Available Vaccines</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-800">COVID-19 Vaccines</h4>
                  <p className="text-sm text-gray-600">Covishield, Covaxin, Sputnik V</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-800">Influenza Vaccine</h4>
                  <p className="text-sm text-gray-600">Annual flu vaccination</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-purple-800">Childhood Vaccines</h4>
                  <p className="text-sm text-gray-600">BCG, DPT, Polio, Measles, etc.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Required Documents</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Aadhaar Card</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Voter ID Card</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Driving License</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>PAN Card</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔗 Quick Links</h3>
              <div className="space-y-3">
                <a href="https://cowin.gov.in" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span>CoWIN Portal</span>
                </a>
                <a href="tel:1075" className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Helpline: 1075</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">⚠️ Important Notes</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Vaccination is free at government centers</p>
                <p>• Bring original ID proof for verification</p>
                <p>• Follow COVID protocols at centers</p>
                <p>• Wait 15 minutes after vaccination</p>
                <p>• Report any adverse effects immediately</p>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">My Vaccination Schedule</h3>
                  <p className="text-sm text-gray-600 mt-1">Manage your vaccination appointments</p>
                </div>
                <button
                  onClick={() => setShowAddSchedule(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Schedule
                </button>
              </div>
            </div>

            {/* Add Schedule Modal */}
            {showAddSchedule && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-gray-900">Add Vaccination Schedule</h4>
                    <button
                      onClick={() => setShowAddSchedule(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Name *</label>
                      <select
                        value={newSchedule.vaccineName}
                        onChange={(e) => setNewSchedule({...newSchedule, vaccineName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Vaccine</option>
                        <option value="COVID-19 (Covishield)">COVID-19 (Covishield)</option>
                        <option value="COVID-19 (Covaxin)">COVID-19 (Covaxin)</option>
                        <option value="Influenza">Influenza</option>
                        <option value="Hepatitis B">Hepatitis B</option>
                        <option value="Tetanus">Tetanus</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input
                        type="date"
                        value={newSchedule.date}
                        onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                      <input
                        type="time"
                        value={newSchedule.time}
                        onChange={(e) => setNewSchedule({...newSchedule, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vaccination Center</label>
                      <input
                        type="text"
                        value={newSchedule.center}
                        onChange={(e) => setNewSchedule({...newSchedule, center: e.target.value})}
                        placeholder="Enter center name or location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={newSchedule.notes}
                        onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                        placeholder="Additional notes or reminders"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowAddSchedule(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addSchedule}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Schedule
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {schedules.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0013.5 21h-3A2 2 0 018.5 15.5L8 7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Yet</h3>
                  <p className="text-gray-600 mb-4">You haven't added any vaccination schedules. Click "Add Schedule" to get started.</p>
                  <button
                    onClick={() => setShowAddSchedule(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Schedule
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <div key={schedule.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                            <h4 className="text-lg font-semibold text-gray-900">{schedule.vaccineName}</h4>
                            <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              {schedule.status}
                            </span>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mt-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-.5 8.5A2 2 0 0013.5 21h-3A2 2 0 018.5 15.5L8 7z" />
                              </svg>
                              {new Date(schedule.date).toLocaleDateString('en-IN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {schedule.time}
                            </div>
                            
                            {schedule.center && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {schedule.center}
                              </div>
                            )}
                          </div>
                          
                          {schedule.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{schedule.notes}</p>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="ml-4 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-blue-900">Reminder Tips</h4>
                </div>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Set phone reminders 1 day before vaccination</li>
                  <li>• Carry original ID proof and vaccination card</li>
                  <li>• Arrive 15 minutes early at the center</li>
                  <li>• Wear comfortable clothing with easy sleeve access</li>
                </ul>
              </div>
              
              <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                <div className="flex items-center mb-4">
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-green-900">Post-Vaccination</h4>
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>• Wait 15-30 minutes at the center for observation</li>
                  <li>• Download your vaccination certificate</li>
                  <li>• Monitor for any side effects for 24 hours</li>
                  <li>• Contact healthcare provider if needed</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccinationPage;
