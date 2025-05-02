const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { adminAuth } = require('../middleware/admin');
const { adminLimiter } = require('../utils/rateLimiter');
const {
  getDoctors,
  searchDoctors,
  createDoctor,
  addAvailability,
  getDoctor
} = require('../controllers/doctorController');
const Doctor = require('../models/Doctor');
const validateDoctorCreation = require('../middleware/validateDoctor');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', asyncHandler(getDoctors));

// @route   GET /api/doctors/search
// @desc    Search doctors
// @access  Public
router.get('/search', asyncHandler(searchDoctors));

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get('/:id', asyncHandler(getDoctor));

// @route   POST /api/doctors
// @desc    Create new doctor (Admin only)
// @access  Private/Admin
router.post(
  '/',
  adminLimiter, // Rate limiting (100 requests/15min)
  asyncHandler(adminAuth), // Admin authorization check
  validateDoctorCreation, // Validation middleware
  asyncHandler(createDoctor) // Controller
);

// @route   POST /api/doctors/:id/availability
// @desc    Add availability slots (Doctor or Admin)
// @access  Private
router.post(
  '/:id/availability',
  asyncHandler(async (req, res, next) => {
    // Verify doctor exists
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    // Authorization check
    if (req.user.role !== 'admin' && doctor.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access'
      });
    }

    next();
  }),
  asyncHandler(addAvailability) // Controller
);

module.exports = router;