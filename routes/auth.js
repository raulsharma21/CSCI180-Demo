const express = require('express');
const router = express.Router();

// Mock user data (in a real app, you would use a database)
const users = [];

router.get('/test', (req, res) => {
    res.json({ 
      message: "This is a test route", 
      your_headers: req.headers,
      your_body: req.body
    });
});

// Registration route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) return res.status(200).json({message: 'User already registered'});
  
  // Create new user and add to the list (you would hash the password in a real app)
  const newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  res.status(201).json({message: 'User registered successfully'});
  console.log(`Created user "${newUser.username}"`)
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check if user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(400).send('Invalid username or password');
  
  // Mock authentication success (you would use JWT or sessions in a real app)
  res.status(200).send('Logged in successfully');
});

// Logout route
router.post('/logout', (req, res) => {
  // Mock logout process
  res.status(200).send('Logged out successfully');
});

// Password reset route
router.post('/reset-password', (req, res) => {
  const { username, newPassword } = req.body;
  
  // Find the user
  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).send('User not found');
  
  // Update password (in a real app, validate and hash the new password)
  user.password = newPassword;
  res.status(200).send('Password reset successfully');
});

module.exports = router;