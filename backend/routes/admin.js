const express = require('express');
const router = express.Router();
const { User, ChatSession, Alert } = require('../models/mongodb');

// Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const activeSessions = await ChatSession.countDocuments();
    const totalAlerts = await Alert.countDocuments({ isActive: true });
    
    // Recent registrations (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({ 
      role: 'user',
      createdAt: { $gte: weekAgo }
    });
    
    res.json({
      totalUsers,
      totalAdmins,
      activeSessions,
      totalAlerts,
      recentUsers,
      systemStatus: 'operational'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments({ role: 'user' });
    
    res.json({
      users,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: users.length,
        totalUsers: total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details with chat history
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const chatHistory = await ChatSession.findOne({ userId: req.params.id });
    
    res.json({
      user,
      chatHistory: chatHistory ? chatHistory.messages : [],
      totalChats: chatHistory ? chatHistory.messages.length : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user information
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, phone, age, location, medicalConditions } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, age, location, medicalConditions },
      { new: true, select: '-password' }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Also delete user's chat history
    await ChatSession.deleteOne({ userId: req.params.id });
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Create health alert
router.post('/alerts', async (req, res) => {
  try {
    const { alertType, disease, message, severity, location } = req.body;
    
    const alert = await Alert.create({
      alertType,
      disease,
      message,
      severity,
      location,
      isActive: true
    });
    
    res.json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// Update alert
router.put('/alerts/:id', async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json({ success: true, alert: updatedAlert });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

// System analytics
router.get('/analytics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    // User registrations over time
    const userGrowth = await User.aggregate([
      { $match: { role: 'user', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Chat activity
    const chatSessions = await ChatSession.find({
      'messages.timestamp': { $gte: thirtyDaysAgo }
    });
    
    const totalMessages = chatSessions.reduce((sum, session) => {
      return sum + session.messages.filter(msg => msg.timestamp >= thirtyDaysAgo).length;
    }, 0);
    
    res.json({
      userGrowth,
      totalMessages,
      activeSessions: chatSessions.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;