const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');

// Middleware for parsing JSON
app.use(express.json());

// Allow all origins (use cautiously)
app.use(cors());

// Serve static HTML files
app.use(express.static(path.join(__dirname, 'public')));

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Serve specific HTML files
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/store', (req, res) => {
  res.sendFile(path.join(__dirname, 'store.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
