const express = require('express');
const router = express.Router();
 
const bcrypt = require('bcryptjs');
const { User } = require('../models/mongodb');

// Demo credentials
const DEMO_USERS = {
  'user@healthbot.com': {
    _id: 'demo-user-1',
    name: 'Demo User',
    email: 'user@healthbot.com',
    password: 'user123',
    role: 'user',
    phone: '+91 9876543210',
    age: 28,
    location: 'Mumbai, Maharashtra',
    language: 'hi',
    medicalConditions: ['Diabetes'],
    totalQuizPoints: 150
  },
  'admin@healthbot.com': {
    _id: 'demo-admin-1',
    name: 'Admin User',
    email: 'admin@healthbot.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 9876543211',
    age: 35,
    location: 'Delhi, India',
    language: 'en',
    medicalConditions: [],
    totalQuizPoints: 0
  }
};

// Login endpoint - MongoDB + Demo users
router.post('/login', async (req, res) => {
  try {
    const { email, password, loginType = 'user' } = req.body;
    console.log('Login attempt:', { email, loginType, hasPassword: !!password });
    
    // Check demo users first
    const demoUser = DEMO_USERS[email];
    console.log('Demo user found:', !!demoUser);
    if (demoUser && demoUser.password === password) {
      console.log('Demo user password match:', demoUser.password === password);
      // Validate login type matches user role
      if (loginType === 'admin' && demoUser.role !== 'admin') {
        return res.status(401).json({ error: 'Admin credentials required' });
      }
      if (loginType === 'user' && demoUser.role === 'admin') {
        return res.status(401).json({ error: 'User credentials required' });
      }
      
      const { password: _, ...userWithoutPassword } = demoUser;
      return res.json({
        success: true,
        user: userWithoutPassword,
        token: 'demo-token-' + demoUser._id
      });
    }
    
    // Check MongoDB users
    const user = await User.findOne({ email });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      // Validate login type matches user role
      if (loginType === 'admin' && user.role !== 'admin') {
        return res.status(401).json({ error: 'Admin credentials required' });
      }
      if (loginType === 'user' && user.role === 'admin') {
        return res.status(401).json({ error: 'User credentials required' });
      }
      
      const { password: _, ...userWithoutPassword } = user.toObject();
      res.json({
        success: true,
        user: userWithoutPassword,
        token: 'jwt-token-' + user._id
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database connection failed. Please try again.' });
  }
});

// Register endpoint - Real user registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, age, location, medicalConditions } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if email is a demo email
    if (DEMO_USERS[email]) {
      return res.status(400).json({ error: 'This email is reserved for demo purposes' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      phone: phone || null,
      age: age || null,
      location: location || null,
      medicalConditions: medicalConditions || [],
      role: 'user',
      totalQuizPoints: 0
    });
    
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.json({
      success: true,
      user: userWithoutPassword,
      token: 'jwt-token-' + newUser._id,
      message: 'Registration successful! Welcome to HealthBot.'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Demo credentials endpoint
router.get('/demo-credentials', (req, res) => {
  res.json({
    user: {
      email: 'user@healthbot.com',
      password: 'user123',
      role: 'user'
    },
    admin: {
      email: 'admin@healthbot.com',
      password: 'admin123',
      role: 'admin'
    }
  });
});

module.exports = router;