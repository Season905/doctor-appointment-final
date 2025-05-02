/**
 * Dummy Appointments Data Module
 * 
 * This module provides a mock database for appointments with the following features:
 * - Initial appointment data
 * - CRUD operations for appointments
 * - Status management
 * - Filtering capabilities
 */

// Initial dummy appointments data
let appointments = [
    {
        _id: 'app1',
        doctorId: 'doc1',
        doctorName: 'Dr. John Smith',
        patientName: 'John Doe',
        patientEmail: 'john.doe@example.com',
        patientPhone: '+1 234-567-8901',
        appointmentDate: '2024-03-25T09:00:00',
        reason: 'Routine Checkup',
        additionalNotes: 'Annual heart checkup',
        status: 'scheduled',
        consultationFee: 150,
        createdAt: '2024-03-20T10:00:00'
    },
    {
        _id: 'app2',
        doctorId: 'doc3',
        doctorName: 'Dr. Michael Chen',
        patientName: 'Jane Smith',
        patientEmail: 'jane.smith@example.com',
        patientPhone: '+1 234-567-8902',
        appointmentDate: '2024-03-26T10:30:00',
        reason: 'Skin Consultation',
        additionalNotes: 'Follow-up for previous treatment',
        status: 'scheduled',
        consultationFee: 130,
        createdAt: '2024-03-21T11:00:00'
    },
    {
        _id: 'app3',
        doctorId: 'doc5',
        doctorName: 'Dr. James Anderson',
        patientName: 'Robert Johnson',
        patientEmail: 'robert.j@example.com',
        patientPhone: '+1 234-567-8903',
        appointmentDate: '2024-03-27T08:00:00',
        reason: 'Knee Pain',
        additionalNotes: 'Persistent pain in right knee',
        status: 'completed',
        consultationFee: 200,
        createdAt: '2024-03-18T09:00:00'
    },
    {
        _id: 'app4',
        doctorId: 'doc2',
        doctorName: 'Dr. Sarah Wilson',
        patientName: 'Emily Davis',
        patientEmail: 'emily.d@example.com',
        patientPhone: '+1 234-567-8904',
        appointmentDate: '2024-03-28T11:00:00',
        reason: 'Child Vaccination',
        additionalNotes: 'Regular vaccination schedule',
        status: 'scheduled',
        consultationFee: 100,
        createdAt: '2024-03-19T14:00:00'
    },
    {
        _id: 'app5',
        doctorId: 'doc7',
        doctorName: 'Dr. Robert Kim',
        patientName: 'Michael Brown',
        patientEmail: 'michael.b@example.com',
        patientPhone: '+1 234-567-8905',
        appointmentDate: '2024-03-29T09:30:00',
        reason: 'Eye Checkup',
        additionalNotes: 'Annual eye examination',
        status: 'scheduled',
        consultationFee: 170,
        createdAt: '2024-03-22T15:00:00'
    }
];

/**
 * Get all appointments
 * @returns {Array} Copy of all appointments
 */
export const getAllAppointments = () => {
    return [...appointments];
};

/**
 * Get appointment by ID
 * @param {string} id - Appointment ID
 * @returns {Object|null} Appointment object or null if not found
 */
export const getAppointmentById = (id) => {
    return appointments.find(appointment => appointment._id === id);
};

/**
 * Get appointments by patient email
 * @param {string} email - Patient's email
 * @returns {Array} Filtered appointments for the patient
 */
export const getAppointmentsByPatientEmail = (email) => {
    return appointments.filter(appointment =>
        appointment.patientEmail.toLowerCase() === email.toLowerCase()
    );
};

/**
 * Get appointments by status
 * @param {string} status - Appointment status (scheduled/completed/cancelled)
 * @returns {Array} Filtered appointments by status
 */
export const getAppointmentsByStatus = (status) => {
    return appointments.filter(appointment =>
        appointment.status.toLowerCase() === status.toLowerCase()
    );
};

/**
 * Add a new appointment
 * @param {Object} appointmentData - Appointment details
 * @returns {Object} New appointment object with generated ID
 */
export const addAppointment = (appointmentData) => {
    const newAppointment = {
        _id: `app${appointments.length + 1}`,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        ...appointmentData
    };
    appointments.push(newAppointment);
    return newAppointment;
};

/**
 * Update appointment status
 * @param {string} id - Appointment ID
 * @param {string} status - New status
 * @returns {Object|null} Updated appointment or null if not found
 */
export const updateAppointmentStatus = (id, status) => {
    const appointmentIndex = appointments.findIndex(app => app._id === id);
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = status;
        return appointments[appointmentIndex];
    }
    return null;
};

/**
 * Cancel an appointment
 * @param {string} id - Appointment ID
 * @returns {Object|null} Cancelled appointment or null if not found
 */
export const cancelAppointment = (id) => {
    const appointmentIndex = appointments.findIndex(app => app._id === id);
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex].status = 'cancelled';
        return appointments[appointmentIndex];
    }
    return null;
};

/**
 * Delete an appointment
 * @param {string} id - Appointment ID
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteAppointment = (id) => {
    const index = appointments.findIndex(app => app._id === id);
    if (index !== -1) {
        appointments.splice(index, 1);
        return true;
    }
    return false;
};

export default appointments; 