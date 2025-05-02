const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required']
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://example.com/default-doctor.jpg'
  },
  availability: {
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String]
  },
  about: {
    type: String,
    required: [true, 'About section is required']
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  education: {
    type: String,
    required: [true, 'Education details are required']
  },
  certifications: [{
    type: String
  }],
  availableSlots: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);