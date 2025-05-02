// models/MedicalHistory.js
const medicalHistorySchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    allergies: [String],
    medications: [String],
    conditions: [String],
    surgeries: [String],
  });