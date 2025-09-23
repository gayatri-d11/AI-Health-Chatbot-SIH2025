const express = require('express');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../middleware/auth');
const router = express.Router();

// Demo credentials
const DEMO_USERS = {
  user: {
    email: 'demo@healthcareai.com',
    password: 'demo123',
    name: 'Demo User',
    phone: '+919876543210'
  },
  admin: {
    email: 'admin@healthcareai.com',
    password: 'admin123',
    name: 'Admin User',
    phone: '+919876543211',
    role: 'admin'
  }
};

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const {
      name, email, password, phone, address, age, gender, 
      bloodGroup, allergies, emergencyContact, preferredLanguage, location
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ 
        error: 'Name, email, password, and phone are required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email or phone number' 
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      phone,
      address: location ? { city: location } : address,
      age: age ? parseInt(age) : undefined,
      gender,
      bloodGroup,
      allergies: Array.isArray(allergies) ? allergies : [],
      emergencyContact: emergencyContact ? { phone: emergencyContact } : undefined,
      preferredLanguage: preferredLanguage || 'English',
      isVerified: true // Auto-verify for demo
    });

    await user.save();
    console.log('User created successfully:', user._id);

    const token = generateToken(user._id);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check demo credentials first
    if (email === DEMO_USERS.user.email && password === DEMO_USERS.user.password) {
      let demoUser = await User.findOne({ email: DEMO_USERS.user.email });
      if (!demoUser) {
        demoUser = new User(DEMO_USERS.user);
        demoUser.isVerified = true;
        await demoUser.save();
      }
      const token = generateToken(demoUser._id);
      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          phone: demoUser.phone,
          role: demoUser.role
        }
      });
    }

    if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
      let demoAdmin = await User.findOne({ email: DEMO_USERS.admin.email });
      if (!demoAdmin) {
        demoAdmin = new User(DEMO_USERS.admin);
        demoAdmin.isVerified = true;
        await demoAdmin.save();
      }
      const token = generateToken(demoAdmin._id);
      return res.json({
        message: 'Admin login successful',
        token,
        user: {
          id: demoAdmin._id,
          name: demoAdmin.name,
          email: demoAdmin.email,
          phone: demoAdmin.phone,
          role: demoAdmin.role
        }
      });
    }

    // Regular user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Please verify your account first' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates here
    delete updates.email; // Don't allow email updates
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Demo credentials endpoint
router.get('/demo-credentials', (req, res) => {
  res.json({
    user: {
      email: DEMO_USERS.user.email,
      password: DEMO_USERS.user.password
    },
    admin: {
      email: DEMO_USERS.admin.email,
      password: DEMO_USERS.admin.password
    }
  });
});

module.exports = router;