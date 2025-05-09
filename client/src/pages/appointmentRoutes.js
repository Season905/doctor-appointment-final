const express = require('express');
const router = express.Router();
const { createAppointment, getAvailableSlots, getAppointments, cancelAppointment } = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.get('/', auth, getAppointments);
router.post('/', auth, createAppointment);
router.get('/slots/:doctorId', auth, getAvailableSlots);
router.patch('/:id/cancel', auth, cancelAppointment);

module.exports = router;