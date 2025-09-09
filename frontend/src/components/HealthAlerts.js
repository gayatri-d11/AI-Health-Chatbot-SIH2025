import React, { useState, useEffect } from 'react';

const HealthAlerts = ({ user }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      // Set default alerts
      setAlerts([
        {
          type: 'seasonal',
          disease: 'Dengue',
          message: 'मानसून में डेंगू से बचाव करें। पानी जमा न होने दें।',
          severity: 'high',
          timestamp: new Date()
        },
        {
          type: 'outbreak',
          disease: 'Chikungunya',
          message: 'चिकनगुनिया के मामले बढ़े हैं। मच्छरों से बचें।',
          severity: 'medium',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      default: return '🔵';
    }
  };

  const subscribeToAlerts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/alerts/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          phone: user?.phone,
          location: user?.location,
          language: user?.language
        })
      });
      
      if (response.ok) {
        setSubscribed(true);
        alert('Successfully subscribed to health alerts!');
      }
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading health alerts...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Alerts</h2>
          <p className="text-gray-600">Stay updated with latest health information</p>
        </div>
        {!subscribed && (
          <button
            onClick={subscribeToAlerts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Subscribe to Alerts
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg text-center">
          <span className="text-2xl mb-2 block">✅</span>
          <p className="font-medium">No active health alerts in your area</p>
          <p className="text-sm mt-1">आपके क्षेत्र में कोई स्वास्थ्य अलर्ट नहीं है</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`border-l-4 p-6 rounded-lg shadow-sm ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{alert.disease}</h3>
                    <p className="text-gray-700 mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Type: {alert.type}</span>
                      <span>Severity: {alert.severity}</span>
                      <span>{new Date(alert.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Contacts */}
      <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">🚨</span>
          Emergency Contacts | आपातकालीन संपर्क
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl mb-2">🚑</div>
            <div className="font-semibold text-red-700">National Emergency</div>
            <div className="text-2xl font-bold text-red-800">108</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl mb-2">🦠</div>
            <div className="font-semibold text-red-700">COVID Helpline</div>
            <div className="text-2xl font-bold text-red-800">1075</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg">
            <div className="text-2xl mb-2">👩</div>
            <div className="font-semibold text-red-700">Women Helpline</div>
            <div className="text-2xl font-bold text-red-800">1091</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAlerts;