// models/Doctor.js
availableSlots: [{
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    booked: { type: Boolean, default: false }
  }]