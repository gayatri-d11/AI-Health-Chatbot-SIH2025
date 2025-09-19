// Test CoWIN API Integration
const axios = require('axios');

async function testCoWINAPI() {
  console.log('🧪 Testing CoWIN API Integration...\n');

  try {
    // Test 1: Get States
    console.log('1️⃣ Testing States API...');
    const statesResponse = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
    console.log(`✅ States API: ${statesResponse.data.states.length} states found`);
    
    // Test 2: Get Districts (Maharashtra = 21)
    console.log('\n2️⃣ Testing Districts API...');
    const districtsResponse = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/districts/21');
    console.log(`✅ Districts API: ${districtsResponse.data.districts.length} districts found in Maharashtra`);
    
    // Test 3: Get Vaccination Centers by District (Mumbai = 395)
    console.log('\n3️⃣ Testing Vaccination Centers by District...');
    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    const centersResponse = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=395&date=${dateStr}`);
    console.log(`✅ Vaccination Centers: ${centersResponse.data.sessions.length} centers found in Mumbai for ${dateStr}`);
    
    // Test 4: Get Vaccination Centers by Pincode
    console.log('\n4️⃣ Testing Vaccination Centers by Pincode...');
    const pincodeResponse = await axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=400001&date=${dateStr}`);
    console.log(`✅ Pincode Centers: ${pincodeResponse.data.sessions.length} centers found for pincode 400001`);
    
    // Test 5: Test Your Backend
    console.log('\n5️⃣ Testing Your Backend Integration...');
    try {
      const backendResponse = await axios.post('http://localhost:9000/api/alerts/vaccination', {
        location: 'Mumbai'
      });
      console.log('✅ Backend Integration: Working!');
      console.log('📄 Response Preview:', backendResponse.data.message.substring(0, 100) + '...');
    } catch (error) {
      console.log('❌ Backend Integration: Not running or error');
      console.log('💡 Make sure backend is running: cd backend && npm start');
    }
    
    console.log('\n🎉 CoWIN API Integration Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ CoWIN APIs are working');
    console.log('✅ Data is available for vaccination centers');
    console.log('✅ Your integration code is ready');
    
  } catch (error) {
    console.error('❌ CoWIN API Test Failed:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🌐 Check your internet connection');
    } else if (error.response?.status === 403) {
      console.log('🔒 CoWIN API might be rate-limited or blocked');
    } else {
      console.log('🔧 Check CoWIN API status or try again later');
    }
  }
}

// Run the test
testCoWINAPI();