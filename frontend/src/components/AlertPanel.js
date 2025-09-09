import React from 'react';

const AlertPanel = ({ alerts }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Health Alerts | स्वास्थ्य अलर्ट</h2>
      
      {alerts.length === 0 ? (
        <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded">
          No active health alerts in your area | आपके क्षेत्र में कोई स्वास्थ्य अलर्ट नहीं है
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{alert.disease}</h3>
                  <p className="mt-1">{alert.message}</p>
                  <p className="text-sm mt-2 opacity-75">
                    Type: {alert.type} | Severity: {alert.severity}
                  </p>
                </div>
                <span className="text-xs bg-white px-2 py-1 rounded">
                  {new Date(alert.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Emergency Contacts | आपातकालीन संपर्क</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>National Emergency:</strong> 108
          </div>
          <div>
            <strong>COVID Helpline:</strong> 1075
          </div>
          <div>
            <strong>Women Helpline:</strong> 1091
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertPanel;