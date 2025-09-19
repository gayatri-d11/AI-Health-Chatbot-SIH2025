const express = require('express');
const router = express.Router();
const { User } = require('../models/mongodb');

// Create first admin user (one-time setup)
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;
    
    // Security check - only allow admin creation with special key
    if (adminKey !== process.env.ADMIN_SETUP_KEY && adminKey !== 'SIH2024_ADMIN_SETUP') {
      return res.status(403).json({ error: 'Invalid admin setup key' });
    }
    
    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Admin password must be at least 8 characters' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const adminUser = await User.create({ 
      name, 
      email, 
      password, 
      role: 'admin',
      phone: null,
      age: null,
      location: 'System Administrator',
      medicalConditions: [],
      totalQuizPoints: 0
    });
    
    const { password: _, ...adminWithoutPassword } = adminUser.toObject();
    res.json({
      success: true,
      admin: adminWithoutPassword,
      message: 'Admin user created successfully'
    });
    
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
});

// Check if admin exists
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    res.json({ adminExists: !!adminExists });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;