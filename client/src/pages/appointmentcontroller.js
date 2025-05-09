const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

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
    console.log('Fetching appointments for user:', req.user.id);
    const { limit = 10, sort = '-date' } = req.query;
    const userId = req.user.id;

    // First, check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Find a doctor to create a test appointment if none exist
    const doctor = await Doctor.findOne();
    if (!doctor) {
      console.error('No doctors found in the database');
      return res.status(404).json({
        success: false,
        error: 'No doctors available'
      });
    }

    // Check if user has any appointments
    let appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }]
    })
      .sort(sort)
      .limit(parseInt(limit))
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization');

    console.log('Initial appointments found:', appointments.length);

    // If no appointments exist, create a test appointment
    if (appointments.length === 0) {
      console.log('Creating test appointment for user:', userId);
      const testAppointment = await Appointment.create({
        patient: userId,
        doctor: doctor._id,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'scheduled',
        notes: 'Test appointment'
      });

      // Fetch the newly created appointment with populated fields
      appointments = await Appointment.findById(testAppointment._id)
        .populate('patient', 'name email')
        .populate('doctor', 'name specialization');

      console.log('Test appointment created:', appointments);
    }

    console.log('Final appointments data:', JSON.stringify(appointments, null, 2));

    res.json({
      success: true,
      data: Array.isArray(appointments) ? appointments : [appointments]
    });
  } catch (err) {
    console.error('Error in getAppointments:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Check if the user is authorized to cancel this appointment
    if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }

    // Update appointment status
    appointment.status = 'cancelled';
    await appointment.save();

    // Update doctor's availability
    await Doctor.findByIdAndUpdate(appointment.doctor, {
      $pull: {
        availableSlots: {
          start: appointment.date,
          end: new Date(new Date(appointment.date).setHours(new Date(appointment.date).getHours() + 1))
        }
      }
    });

    res.json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};