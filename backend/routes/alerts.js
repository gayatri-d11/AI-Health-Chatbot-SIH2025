const express = require('express');
const router = express.Router();
const { Alert } = require('../models/mongodb');
const { findVaccinationCenters } = require('../services/cowin');

// Real-time health alerts from government sources and medical institutions

// Get health alerts from MongoDB
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    res.status(500).json({ error: 'Unable to fetch health alerts at this time' });
  }
});

// Get vaccination centers by location
router.post('/vaccination', async (req, res) => {
  try {
    const { location } = req.body;
    
    if (!location) {
      return res.status(400).json({ error: 'Location is required' });
    }
    
    const vaccinationInfo = await findVaccinationCenters(location);
    
    res.json({
      success: true,
      message: vaccinationInfo,
      location: location
    });
    
  } catch (error) {
    console.error('Vaccination alert error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vaccination information',
      message: '🏥 For vaccination info, call 1075 or visit cowin.gov.in'
    });
  }
});

module.exports = router;