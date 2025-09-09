const express = require('express');
const router = express.Router();

// In-memory users (for demo; use DB for production)
const users = [
  { id: 1, name: 'Demo User', email: 'user@demo.com', password: 'demo123', role: 'user' },
  { id: 2, name: 'Admin User', email: 'admin@demo.com', password: 'admin123', role: 'admin' }
];

// Login endpoint
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      user: userWithoutPassword,
      token: 'demo-token-' + user.id
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Register endpoint
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    role: 'user'
  };
  
  users.push(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({
    success: true,
    user: userWithoutPassword,
    token: 'demo-token-' + newUser.id
  });
});

module.exports = router;