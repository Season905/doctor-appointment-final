/**
 * MyAppointmentsPage Component
 * 
 * This component displays a list of appointments for the logged-in patient, including:
 * - Appointment details
 * - Doctor information
 * - Status management
 * - Cancellation functionality
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { getAppointmentsByPatientEmail, cancelAppointment } from '../data/dummyAppointments';
import { getDoctorById } from '../data/dummyDoctors';
import { format } from 'date-fns';

const MyAppointmentsPage = () => {
    // Navigation hook for routing
    const navigate = useNavigate();

    // State management for appointments and UI states
    const [appointments, setAppointments] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // For demo purposes, using a fixed email
    const patientEmail = 'john.doe@example.com';

    // Fetch appointments when component mounts
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Function to fetch appointments for the patient
    const fetchAppointments = () => {
        try {
            // Get appointments from dummy database
            const patientAppointments = getAppointmentsByPatientEmail(patientEmail);
            setAppointments(patientAppointments);

            // Fetch doctor details for each appointment
            const details = {};
            patientAppointments.forEach(appointment => {
                const doctor = getDoctorById(appointment.doctorId);
                if (doctor) {
                    details[appointment.doctorId] = doctor;
                }
            });
            setDoctorDetails(details);

            setLoading(false);
        } catch (err) {
            setError('Failed to load appointments. Please try again later.');
            setLoading(false);
        }
    };

    // Function to handle appointment cancellation
    const handleCancelAppointment = (appointmentId) => {
        try {
            // Cancel appointment in dummy database
            const cancelledAppointment = cancelAppointment(appointmentId);
            if (cancelledAppointment) {
                // Update local state with cancelled appointment
                setAppointments(prevAppointments =>
                    prevAppointments.map(app =>
                        app._id === appointmentId ? cancelledAppointment : app
                    )
                );
                setSuccessMessage('Appointment cancelled successfully');
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(null), 3000);
            }
        } catch (err) {
            setError('Failed to cancel appointment. Please try again.');
        }
    };

    // Helper function to get status badge with appropriate color
    const getStatusBadge = (status) => {
        const variants = {
            scheduled: 'primary',
            completed: 'success',
            cancelled: 'danger'
        };
        return <Badge bg={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
    };

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // Main appointments view
    return (
        <Container className="my-5">
            <h2 className="mb-4">My Appointments</h2>

            {/* Error alert */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {/* Success message alert */}
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
                    {successMessage}
                </Alert>
            )}

            {/* Empty state */}
            {appointments.length === 0 ? (
                <Card>
                    <Card.Body className="text-center">
                        <h4>No appointments found</h4>
                        <p>You haven't booked any appointments yet.</p>
                        <Button
                            variant="primary"
                            onClick={() => navigate('/doctors')}
                        >
                            Book an Appointment
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                // Appointments grid
                <Row>
                    {appointments.map((appointment) => {
                        const doctor = doctorDetails[appointment.doctorId];
                        return (
                            <Col key={appointment._id} md={6} lg={4} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        {/* Doctor name and status */}
                                        <Card.Title className="d-flex justify-content-between align-items-center">
                                            {appointment.doctorName}
                                            {getStatusBadge(appointment.status)}
                                        </Card.Title>
                                        {/* Doctor specialization and hospital */}
                                        {doctor && (
                                            <Card.Subtitle className="mb-2 text-muted">
                                                {doctor.specialization} • {doctor.hospital}
                                            </Card.Subtitle>
                                        )}
                                        {/* Appointment date */}
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {format(new Date(appointment.appointmentDate), 'MMMM d, yyyy h:mm a')}
                                        </Card.Subtitle>
                                        {/* Appointment details */}
                                        <Card.Text>
                                            {doctor && (
                                                <>
                                                    <strong>Location:</strong> {doctor.location}<br />
                                                    <strong>Qualification:</strong> {doctor.qualification}<br />
                                                </>
                                            )}
                                            <strong>Reason:</strong> {appointment.reason}<br />
                                            <strong>Notes:</strong> {appointment.additionalNotes}<br />
                                            <strong>Fee:</strong> ${appointment.consultationFee}
                                        </Card.Text>
                                        {/* Cancel button for scheduled appointments */}
                                        {appointment.status === 'scheduled' && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                            >
                                                Cancel Appointment
                                            </Button>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
};

export default MyAppointmentsPage; 