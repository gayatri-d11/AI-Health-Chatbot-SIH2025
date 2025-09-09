const express = require('express');
const router = express.Router();

// Get user profile
router.get('/profile', (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

module.exports = router;