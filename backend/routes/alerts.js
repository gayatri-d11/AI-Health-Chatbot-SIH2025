const express = require('express');
const router = express.Router();

// Get health alerts
router.get('/', (req, res) => {
  const alerts = [
    { id: 1, type: 'vaccination', message: 'COVID booster due', priority: 'medium' },
    { id: 2, type: 'outbreak', message: 'Dengue cases in your area', priority: 'high' }
  ];
  res.json(alerts);
});

module.exports = router;