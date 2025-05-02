const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, notes } = req.body;

    // Validate request
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Doctor ID and date are required' });
    }

    // Check doctor availability
    const doctor = await Doctor.findById(doctorId);
    const isAvailable = doctor.availableSlots.some(slot =>
      slot.start <= new Date(date) && slot.end >= new Date(date) && !slot.booked
    );

    if (!isAvailable) {
      return res.status(400).json({ error: 'Selected slot is not available' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      notes
    });

    // Update doctor's availability
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: {
        availableSlots: {
          start: new Date(date),
          end: new Date(new Date(date).setHours(new Date(date).getHours() + 1)),
          booked: true
        }
      }
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get available slots for a doctor
exports.getAvailableSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    const availableSlots = doctor.availableSlots
      .filter(slot => !slot.booked)
      .map(slot => ({
        start: slot.start,
        end: slot.end
      }));

    res.json(availableSlots);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get appointments with pagination and sorting
exports.getAppointments = async (req, res) => {
  try {
    const { limit = 10, sort = '-date' } = req.query;
    const userId = req.user.id;

    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }]
    })
      .sort(sort)
      .limit(parseInt(limit))
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    res.json({
      success: true,
      data: appointments
    });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};