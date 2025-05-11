// models/MedicalHistory.js
const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  patient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Ensure a patient is always linked
  },
  allergies: { 
    type: [String], 
    default: [] 
  },
  medications: { 
    type: [String], 
    default: [] 
  },
  conditions: { 
    type: [String], 
    default: [] 
  },
  surgeries: { 
    type: [String], 
    default: [] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Automatically update `updatedAt` on save
medicalHistorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);

module.exports = MedicalHistory;
