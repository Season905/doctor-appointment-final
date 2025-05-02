const { body } = require('express-validator');
const Doctor = require('../models/Doctor');

const validateDoctorCreation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  
  body('email')
    .isEmail().withMessage('Invalid email address')
    .custom(async email => {
      const doctor = await Doctor.findOne({ email });
      if (doctor) throw new Error('Email already in use');
    }),
  
  body('specialization')
    .trim()
    .notEmpty().withMessage('Specialization is required'),
  
  body('licenseNumber')
    .matches(/^[A-Z]{3}-\d{6}$/).withMessage('Invalid license format (AAA-123456)')
];

module.exports = validateDoctorCreation;