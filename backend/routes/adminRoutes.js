const express = require('express');
const User = require('../models/User');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users (Admin only)
router.get('/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID (Admin only)
router.get('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status (Admin only)
router.put('/users/:id/status', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats (Admin only)
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ role: 'user', isVerified: true });
    const recentUsers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    const usersByState = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: '$address.state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        recentUsers,
        usersByState
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;