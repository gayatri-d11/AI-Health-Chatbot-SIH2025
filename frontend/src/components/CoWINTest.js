import React, { useState } from 'react';

const CoWINTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const testCoWINConnection = async () => {
    setLoading(true);
    const results = [];

    // Test 1: Backend Health Check
    try {
      const response = await fetch('http://localhost:8000/health');
      const data = await response.json();
      results.push({
        test: 'Backend Health Check',
        status: response.ok ? '✅ PASS' : '❌ FAIL',
        details: `Status: ${data.status}, Time: ${data.timestamp}`
      });
    } catch (error) {
      results.push({
        test: 'Backend Health Check',
        status: '❌ FAIL',
        details: `Error: Backend not running on port 9000`
      });
    }

    // Test 2: Vaccination API with Pincode
    try {
      const response = await fetch('http://localhost:8000/api/alerts/vaccination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: '110001' })
      });
      const data = await response.json();
      const hasVaccinationData = data.message && (
        data.message.includes('Vaccination') || 
        data.message.includes('Center') ||
        data.message.includes('cowin.gov.in') ||
        data.message.includes('1075')
      );
      results.push({
        test: 'Vaccination API (Pincode 110001)',
        status: response.ok && hasVaccinationData ? '✅ PASS' : '❌ FAIL',
        details: `Message: ${data.message?.length || 0} chars, Has vaccination data: ${hasVaccinationData ? 'Yes' : 'No'}`
      });
    } catch (error) {
      results.push({
        test: 'Vaccination API (Pincode 110001)',
        status: '❌ FAIL',
        details: `Error: ${error.message}`
      });
    }

    // Test 3: Vaccination API with City Name
    try {
      const response = await fetch('http://localhost:8000/api/alerts/vaccination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location: 'Mumbai' })
      });
      const data = await response.json();
      const hasVaccinationData = data.message && (
        data.message.includes('Vaccination') || 
        data.message.includes('Center') ||
        data.message.includes('cowin.gov.in') ||
        data.message.includes('1075')
      );
      results.push({
        test: 'Vaccination API (Mumbai)',
        status: response.ok && hasVaccinationData ? '✅ PASS' : '❌ FAIL',
        details: `Message: ${data.message?.length || 0} chars, Has vaccination data: ${hasVaccinationData ? 'Yes' : 'No'}`
      });
    } catch (error) {
      results.push({
        test: 'Vaccination API (Mumbai)',
        status: '❌ FAIL',
        details: `Error: ${error.message}`
      });
    }

    // Test 4: Chat API with Vaccination Query
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'vaccination centers near me',
          userId: 'test-user',
          language: 'en'
        })
      });
      const data = await response.json();
      const hasVaccinationInfo = data.response && (
        data.response.includes('vaccination') || 
        data.response.includes('vaccine') ||
        data.response.includes('CoWIN') ||
        data.response.includes('1075')
      );
      results.push({
        test: 'Chat API (Vaccination Query)',
        status: response.ok && hasVaccinationInfo ? '✅ PASS' : '❌ FAIL',
        details: `Response: ${data.response?.length || 0} chars, Has vaccination info: ${hasVaccinationInfo ? 'Yes' : 'No'}`
      });
    } catch (error) {
      results.push({
        test: 'Chat API (Vaccination Query)',
        status: '❌ FAIL',
        details: `Error: ${error.message}`
      });
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">🔍 CoWIN Integration Test</h2>
      
      <button
        onClick={testCoWINConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 mb-6"
      >
        {loading ? (
          <>
            <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Testing...
          </>
        ) : (
          'Run CoWIN Integration Test'
        )}
      </button>

      {testResults && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Test Results:</h3>
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{result.test}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.status.includes('✅') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">{result.details}</p>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">How to Verify CoWIN Data:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ✅ All tests should show "PASS" status</li>
              <li>• 📊 Message length should be > 100 characters for real data</li>
              <li>• 🏥 Response should contain vaccination center names and addresses</li>
              <li>• 📞 Response should include helpline numbers (1075)</li>
              <li>• 🔗 Response should mention CoWIN portal link</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoWINTest;
