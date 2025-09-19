import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VaccinationPage = () => {
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [vaccinationData, setVaccinationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

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

  const searchVaccination = async () => {
    if (!location.trim()) {
      alert('Please enter your location or pincode');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/api/alerts/vaccination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          location: location.trim(),
          date: selectedDate 
        })
      });

      const data = await response.json();
      setVaccinationData(data);
    } catch (error) {
      console.error('Vaccination API Error:', error);
      setVaccinationData({
        success: false,
        message: `🚨 **Connection Error**\n\nUnable to connect to vaccination service.\n\n**Possible causes:**\n• Backend server not running on port 9000\n• Network connectivity issues\n• CoWIN API temporarily unavailable\n\n**Solutions:**\n• Check if backend server is running\n• Try again in a few minutes\n• Call helpline: 1075\n• Visit: cowin.gov.in\n\n**Error:** ${error.message}`
      });
    }
    setLoading(false);
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
            {/* Search Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Find Vaccination Centers</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 Location (District/Pincode)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Mumbai, Pune, 110001, 400001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📅 Select Date
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {getNext7Days().slice(0, 4).map((dateObj, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDate(dateObj.date)}
                        className={`p-2 text-xs rounded-lg border transition-colors ${
                          selectedDate === dateObj.date
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {dateObj.isToday ? 'Today' : dateObj.display}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={searchVaccination}
                disabled={loading}
                className="mt-6 w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Find Vaccination Centers
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {vaccinationData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Search Results</h3>
                <div 
                  className="prose max-w-none text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: vaccinationData.message
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-800">$1</strong>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              </div>
            )}
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">📅 Vaccination Schedule</h3>
            
            <div className="grid md:grid-cols-7 gap-4 mb-6">
              {getNext7Days().map((dateObj, index) => (
                <div key={index} className={`p-4 rounded-lg border text-center ${
                  dateObj.isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="text-sm font-medium text-gray-900">
                    {dateObj.isToday ? 'Today' : dateObj.display}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {dateObj.date}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-xs text-gray-600 ml-1">Available</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">
                  Vaccination centers typically operate from 9:00 AM to 5:00 PM. 
                  Availability may vary by location and vaccine type.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaccinationPage;