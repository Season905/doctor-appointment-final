// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { adminAuth } = require('../middleware/admin'); // Fixed import
const User = require('../models/User');

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
    const users = await User.find().select('-password');
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
// Add to server/routes/adminRoutes.js
router.get(
  '/dashboard',
  adminLimiter,
  adminAuth,
  asyncHandler(async (req, res) => {
    const stats = {
      totalUsers: await User.countDocuments(),
      recentUsers: await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('-password'),
      // Add other dashboard metrics
    };

    res.json({
      success: true,
      data: stats
    });
  })
);

module.exports = router;