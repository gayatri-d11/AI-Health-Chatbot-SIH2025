const express = require('express');
const router = express.Router();

// Admin dashboard data
router.get('/dashboard', (req, res) => {
  res.json({
    totalUsers: 1250,
    activeChats: 45,
    healthAlerts: 12,
    systemStatus: 'operational'
  });
});

module.exports = router;