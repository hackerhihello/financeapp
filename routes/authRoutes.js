// routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, phonenumber, password, amount } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, phonenumber, password: hashedPassword, amount });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phonenumber, password } = req.body;
    const user = await User.findOne({ phonenumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, 'jhgfdsawqertyuimnbvcxzghjktyufgsser', { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const invalidTokens = [];

// Logout handling
router.post('/logout', (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token is missing.' });
  }

  // Add the token to the invalid tokens list
  invalidTokens.push(token);

  res.json({ message: 'Logout successful' });
});

// Middleware to check if a token is valid
const isTokenValid = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token is missing.' });
  }

  if (invalidTokens.includes(token)) {
    return res.status(401).json({ message: 'Token is no longer valid. Please log in again.' });
  }

  // If token is not in the invalid list, continue to the next middleware
  next();
};

// Example protected route that checks for a valid token
router.get('/protected-route', isTokenValid, (req, res) => {
  res.json({ message: 'You have access to this protected route.' });
});


router.runtime = "nodejs16.x";
module.exports = router;
