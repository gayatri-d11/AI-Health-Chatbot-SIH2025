const express = require('express');
const router = express.Router();
const { User } = require('../models/mongodb');

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if it's a demo user
    if (userId === 'demo-user-1') {
      return res.json({
        _id: 'demo-user-1',
        name: 'Demo User',
        email: 'user@healthbot.com',
        role: 'user',
        phone: '+91 9876543210',
        age: 28,
        location: 'Mumbai, Maharashtra',
        language: 'hi',
        medicalConditions: ['Diabetes'],
        totalQuizPoints: 150
      });
    }
    
    if (userId === 'demo-admin-1') {
      return res.json({
        _id: 'demo-admin-1',
        name: 'Admin User',
        email: 'admin@healthbot.com',
        role: 'admin',
        phone: '+91 9876543211',
        age: 35,
        location: 'Delhi, India',
        language: 'en',
        medicalConditions: [],
        totalQuizPoints: 0
      });
    }
    
    // Get from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userWithoutPassword } = user.toObject();
    res.json(userWithoutPassword);
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

module.exports = router;