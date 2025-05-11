// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { adminAuth } = require('../middleware/admin'); // Fixed import
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Add rate limiter if needed
const rateLimit = require('express-rate-limit');
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later"
});

// Get all users
router.get(
  '/users',
  adminLimiter,
  adminAuth,
  asyncHandler(async (req, res) => {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json({ 
      success: true, 
      count: users.length,
      data: users 
    });
  })
);

// Delete user
router.delete(
  '/users/:id',
  adminAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  })
);

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Dashboard Stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('-password');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        recentUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;