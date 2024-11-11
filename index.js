// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');

// Use the authentication routes
app.use('/api/auth', authRoutes);

// Middleware for parsing JSON
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});