const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAppointmentStats,
  getUserStats,
  getDoctorStats
} = require('../controllers/statsController');

// Main dashboard stats (for all authenticated users)
router.get('/dashboard', auth, getDashboardStats);

// Detailed appointment statistics (admin only)
router.get('/appointments', auth, admin, getAppointmentStats);

// User statistics (admin only)
router.get('/users', auth, admin, getUserStats);

// Doctor-specific statistics (admin and doctors)
const doctorOrAdmin = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'doctor') {
    return next();
  }
  res.status(403).json({ error: 'Unauthorized access' });
};

router.get('/doctors', auth, doctorOrAdmin, getDoctorStats);

module.exports = router;