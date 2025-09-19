import React, { useState } from 'react';

const VaccinationAlert = ({ userLocation }) => {
  const [vaccinationInfo, setVaccinationInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(userLocation || '');

  const fetchVaccinationInfo = async () => {
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
        body: JSON.stringify({ location: location.trim() })
      });

      const data = await response.json();
      
      if (data.success) {
        setVaccinationInfo(data.message);
      } else {
        setVaccinationInfo(data.message || 'Unable to fetch vaccination information');
      }
    } catch (error) {
      setVaccinationInfo('🏥 For vaccination info, call 1075 or visit cowin.gov.in');
    }
    setLoading(false);
  };

  return (
    <div className="vaccination-alert bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-blue-900">💉 Vaccination Centers</h3>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location, district, or pincode"
            className="flex-1 px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={fetchVaccinationInfo}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Centers
              </>
            )}
          </button>
        </div>

        {vaccinationInfo && (
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div 
              className="text-sm text-gray-800 whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: vaccinationInfo
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-800">$1</strong>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </div>
        )}

        <div className="bg-blue-100 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Quick Links:</h4>
          <div className="space-y-2 text-sm">
            <a href="https://cowin.gov.in" target="_blank" rel="noopener noreferrer" 
               className="flex items-center text-blue-600 hover:text-blue-800">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              CoWIN Portal - Book Appointment
            </a>
            <div className="flex items-center text-blue-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Helpline: 1075
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationAlert;