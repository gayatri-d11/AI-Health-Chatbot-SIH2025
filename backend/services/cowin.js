const axios = require('axios');

// CoWIN API Base URL
const COWIN_BASE_URL = 'https://cdn-api.co-vin.in/api/v2';

// Get all states
async function getStates() {
  try {
    const response = await axios.get(`${COWIN_BASE_URL}/admin/location/states`);
    return response.data.states;
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
}

// Get districts by state ID
async function getDistricts(stateId) {
  try {
    const response = await axios.get(`${COWIN_BASE_URL}/admin/location/districts/${stateId}`);
    return response.data.districts;
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
}

// Get vaccination sessions by district
async function getVaccinationByDistrict(districtId, date = null) {
  try {
    const searchDate = date || getCurrentDate();
    const response = await axios.get(`${COWIN_BASE_URL}/appointment/sessions/public/findByDistrict`, {
      params: {
        district_id: districtId,
        date: searchDate
      }
    });
    return response.data.sessions || [];
  } catch (error) {
    console.error('Error fetching vaccination sessions:', error);
    return [];
  }
}

// Get vaccination sessions by pincode
async function getVaccinationByPincode(pincode, date = null) {
  try {
    const searchDate = date || getCurrentDate();
    const response = await axios.get(`${COWIN_BASE_URL}/appointment/sessions/public/findByPin`, {
      params: {
        pincode: pincode,
        date: searchDate
      }
    });
    return response.data.sessions || [];
  } catch (error) {
    console.error('Error fetching vaccination sessions:', error);
    return [];
  }
}

// Get current date in DD-MM-YYYY format
function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
}

// Format vaccination info for chatbot
function formatVaccinationInfo(sessions, location) {
  if (!sessions || sessions.length === 0) {
    return `💉 **Vaccination Centers in ${location}:**\n\n🏥 **No live sessions today, but vaccination is available at:**\n• Government Health Centers\n• Primary Health Centers\n• Community Health Centers\n\n📞 **Book Vaccination:**\n• CoWIN Portal: cowin.gov.in\n• Aarogya Setu App\n• Vaccination Helpline: 1075\n\n💊 **Available Vaccines:** COVID-19, Routine Immunization\n🆔 **Required:** Aadhaar Card/Photo ID`;
  }

  let message = `💉 **Vaccination Available in ${location}:**\n\n`;
  
  sessions.slice(0, 5).forEach((session, index) => {
    message += `**${index + 1}. ${session.name}**\n`;
    message += `📍 Address: ${session.address}\n`;
    message += `💊 Vaccine: ${session.vaccine}\n`;
    message += `🎯 Age Limit: ${session.min_age_limit}+ years\n`;
    message += `💺 Available: ${session.available_capacity} slots\n`;
    message += `⏰ Time: ${session.from} - ${session.to}\n`;
    message += `💰 Fee: ${session.fee_type}\n\n`;
  });

  message += `📞 **Book Appointment:** CoWIN Portal or Aarogya Setu App\n`;
  message += `🆔 **Required:** Aadhaar/Voter ID/Driving License\n`;
  message += `ℹ️ **Helpline:** 1075`;

  return message;
}

// Find vaccination centers based on user location
async function findVaccinationCenters(userLocation) {
  try {
    // Try to extract pincode from location
    const pincodeMatch = userLocation.match(/\b\d{6}\b/);
    
    if (pincodeMatch) {
      const pincode = pincodeMatch[0];
      const sessions = await getVaccinationByPincode(pincode);
      return formatVaccinationInfo(sessions, `Pincode ${pincode}`);
    }

    // If no pincode, try to find by district name
    const states = await getStates();
    let foundDistrict = null;

    for (const state of states) {
      const districts = await getDistricts(state.state_id);
      foundDistrict = districts.find(district => 
        userLocation.toLowerCase().includes(district.district_name.toLowerCase())
      );
      
      if (foundDistrict) {
        const sessions = await getVaccinationByDistrict(foundDistrict.district_id);
        return formatVaccinationInfo(sessions, foundDistrict.district_name);
      }
    }

    // Fallback message with proper vaccination keywords
    return `💉 **Vaccination Centers Near You:**\n\n**Available Vaccination Options:**\n• COVID-19 Vaccination Centers\n• Routine Immunization Centers\n• Government Health Centers\n\n**How to Find Centers:**\n• Visit CoWIN Portal: cowin.gov.in\n• Use Aarogya Setu App\n• Call Vaccination Helpline: 1075\n\n**Required Documents:**\n• Aadhaar Card/Voter ID\n• Photo ID Proof\n\n**Note:** Vaccination is free at all government centers`;

  } catch (error) {
    console.error('Error finding vaccination centers:', error);
    return `💉 **Vaccination Centers Information:**\n\n**COVID-19 Vaccination:**\n• Available at all government centers\n• Free vaccination for all citizens\n• Multiple vaccine options available\n\n**Booking Methods:**\n• CoWIN Portal: cowin.gov.in\n• Aarogya Setu App\n• Walk-in at nearby centers\n\n**Vaccination Helpline:** 1075\n**Emergency:** 108`;
  }
}

module.exports = {
  getStates,
  getDistricts,
  getVaccinationByDistrict,
  getVaccinationByPincode,
  findVaccinationCenters,
  formatVaccinationInfo
};