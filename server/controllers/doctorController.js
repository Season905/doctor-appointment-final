const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// @desc    Get all doctors with availability
// @route   GET /api/doctors
exports.getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find()
    .populate('user', 'name email hospital')
    .select('-__v');

  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

// @desc    Search doctors
// @route   GET /api/doctors/search
exports.searchDoctors = asyncHandler(async (req, res) => {
  const { specialization, name, hospital } = req.query;
  const query = {};

  if (specialization) {
    query.specialization = { $regex: specialization, $options: 'i' };
  }

  if (hospital) {
    const users = await User.find({
      hospital: { $regex: hospital, $options: 'i' },
      role: 'doctor'
    });
    query.userId = { $in: users.map(u => u._id) };
  }

  if (name) {
    const users = await User.find({
      name: { $regex: name, $options: 'i' },
      role: 'doctor'
    });
    query.userId = query.userId ?
      { $in: [...query.userId.$in, ...users.map(u => u._id)] } :
      { $in: users.map(u => u._id) };
  }

  const doctors = await Doctor.find(query)
    .populate('user', 'name email hospital')
    .select('-__v');

  res.json({
    success: true,
    count: doctors.length,
    data: doctors
  });
});

// @desc    Create doctor profile (Admin only)
// @route   POST /api/doctors
exports.createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    specialization,
    licenseNumber,
    consultationFee,
    hospital
  } = req.body;

  // Validation
  if (!name || !email || !password || !specialization || !licenseNumber || !consultationFee) {
    return res.status(400).json({
      success: false,
      error: 'Please fill all required fields'
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  if (!/^[A-Z]{3}-\d{6}$/.test(licenseNumber)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid license number format (AAA-123456)'
    });
  }

  if (consultationFee < 50) {
    return res.status(400).json({
      success: false,
      error: 'Minimum consultation fee is $50'
    });
  }

  // Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'User already exists with this email'
    });
  }

  // Check existing license
  const existingLicense = await Doctor.findOne({ licenseNumber });
  if (existingLicense) {
    return res.status(400).json({
      success: false,
      error: 'License number already registered'
    });
  }

  try {
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      hospital
    });

    // Create doctor profile
    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      licenseNumber,
      consultationFee
    });

    res.status(201).json({
      success: true,
      data: {
        ...doctor.toObject(),
        user: {
          name: user.name,
          email: user.email,
          hospital: user.hospital
        }
      }
    });

  } catch (error) {
    console.error('Doctor creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during doctor creation'
    });
  }
});

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = asyncHandler(async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone')
      .select('-__v');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// @desc    Add doctor availability
// @route   POST /api/doctors/:id/availability
// @access  Private (Doctor only)
exports.addAvailability = asyncHandler(async (req, res) => {
  const { date, startTime, endTime } = req.body;

  // Validation
  if (!date || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      error: 'Please provide date, start time, and end time'
    });
  }

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({
      success: false,
      error: 'Doctor not found'
    });
  }

  // Check if doctor owns this profile
  if (doctor.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to update this doctor profile'
    });
  }

  // Add availability
  doctor.availability.push({ date, startTime, endTime });
  await doctor.save();

  res.status(200).json({
    success: true,
    data: doctor.availability
  });
});