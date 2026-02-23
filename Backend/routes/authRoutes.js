// routes/authRoutes.js
const express = require('express');
const verifyAppwriteToken = require('../middlewares/authmiddlewares');
const User = require('../models/userModels');

const router = express.Router();

// Register route - creates user in MongoDB after Appwrite authentication
router.post('/register', verifyAppwriteToken, async (req, res) => {
  try {
    const { role, email, userId } = req.body;
    
    // Check if user already exists in MongoDB
    let user = await User.findOne({ appwriteId: userId });
    
    if (user) {
      return res.status(400).json({ message: 'User already registered' });
    }

    // Create new user in MongoDB
    user = new User({
      appwriteId: userId,
      email: email,
      role: role || 'user'
    });

    await user.save();

    // Set cookie with userID
    res.cookie('userID', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', verifyAppwriteToken, async (req, res) => {
  try {
    const { userId } = req;
    
    // Find user in MongoDB
    const user = await User.findOne({ appwriteId: userId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    // Set cookie
    res.cookie('userID', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({ 
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;