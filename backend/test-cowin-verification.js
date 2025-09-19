const axios = require('axios');
const { findVaccinationCenters, getStates, getDistricts, getVaccinationByPincode } = require('./services/cowin');

console.log('🔍 CoWIN API Integration Verification Test\n');

async function testCoWINIntegration() {
  console.log('='.repeat(60));
  console.log('📋 COWIN API INTEGRATION VERIFICATION');
  console.log('='.repeat(60));

  // Test 1: Direct CoWIN API Connection
  console.log('\n1️⃣ Testing Direct CoWIN API Connection...');
  try {
    const response = await axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states');
    if (response.data && response.data.states) {
      console.log('✅ CoWIN API is accessible');
      console.log(`📊 Found ${response.data.states.length} states`);
      console.log('📍 Sample states:', response.data.states.slice(0, 3).map(s => s.state_name).join(', '));
    }
  } catch (error) {
    console.log('❌ CoWIN API connection failed:', error.message);
    return false;
  }

  // Test 2: Backend Service Functions
  console.log('\n2️⃣ Testing Backend Service Functions...');
  try {
    const states = await getStates();
    if (states && states.length > 0) {
      console.log('✅ getStates() working');
      console.log(`📊 Retrieved ${states.length} states`);
      
      // Test districts for Maharashtra (state_id: 21)
      const districts = await getDistricts(21);
      if (districts && districts.length > 0) {
        console.log('✅ getDistricts() working');
        console.log(`📊 Retrieved ${districts.length} districts for Maharashtra`);
      }
    }
  } catch (error) {
    console.log('❌ Backend service functions failed:', error.message);
  }

  // Test 3: Vaccination Center Search by Pincode
  console.log('\n3️⃣ Testing Vaccination Search by Pincode...');
  const testPincodes = ['110001', '400001', '560001', '600001'];
  
  for (const pincode of testPincodes) {
    try {
      const sessions = await getVaccinationByPincode(pincode);
      console.log(`📍 Pincode ${pincode}: ${sessions.length} centers found`);
      if (sessions.length > 0) {
        console.log(`   Sample: ${sessions[0].name} - ${sessions[0].vaccine || 'N/A'}`);
      }
    } catch (error) {
      console.log(`❌ Pincode ${pincode} failed:`, error.message);
    }
  }

  // Test 4: Full Integration Test
  console.log('\n4️⃣ Testing Full Integration (findVaccinationCenters)...');
  const testLocations = ['110001', 'Mumbai', 'Delhi', 'Bangalore'];
  
  for (const location of testLocations) {
    try {
      const result = await findVaccinationCenters(location);
      console.log(`📍 Location "${location}":`);
      console.log(`   Response length: ${result.length} characters`);
      console.log(`   Contains vaccination info: ${result.includes('Vaccination') ? '✅' : '❌'}`);
      console.log(`   Contains CoWIN link: ${result.includes('cowin.gov.in') ? '✅' : '❌'}`);
    } catch (error) {
      console.log(`❌ Location "${location}" failed:`, error.message);
    }
  }

  // Test 5: Backend API Endpoint Test
  console.log('\n5️⃣ Testing Backend API Endpoint...');
  try {
    const response = await axios.post('http://localhost:9000/api/alerts/vaccination', {
      location: '110001',
      date: getCurrentDate()
    });
    
    if (response.data) {
      console.log('✅ Backend API endpoint working');
      console.log('📊 Response structure:', Object.keys(response.data));
      console.log('📝 Message preview:', response.data.message?.substring(0, 100) + '...');
    }
  } catch (error) {
    console.log('❌ Backend API endpoint failed:', error.message);
    console.log('💡 Make sure backend server is running on port 9000');
  }

  console.log('\n' + '='.repeat(60));
  console.log('📋 VERIFICATION COMPLETE');
  console.log('='.repeat(60));
}

function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

// Run the test
testCoWINIntegration().catch(console.error);