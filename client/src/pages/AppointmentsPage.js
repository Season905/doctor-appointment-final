import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { getAllAppointments } from '../data/dummyAppointments';
import { useAuth } from '../context/AuthContext';

const AppointmentsPage = () => {
    const location = useLocation();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [filter, setFilter] = useState('all'); // all, upcoming, past
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Load appointments
        const loadAppointments = () => {
            const allAppointments = getAllAppointments();
            // Filter appointments for the current user
            const userAppointments = allAppointments.filter(
                apt => apt.patientEmail === user?.email
            );
            setAppointments(userAppointments);
        };

        loadAppointments();

        // Show success message if navigated from booking
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the message after 5 seconds
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location.state, user]);

    const getStatusBadgeVariant = (status) => {
        switch (status.toLowerCase()) {
            case 'scheduled':
                return 'primary';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const formatDate = (dateString) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const filterAppointments = () => {
        const now = new Date();
        return appointments.filter(apt => {
            const aptDate = new Date(apt.appointmentDate);
            switch (filter) {
                case 'upcoming':
                    return aptDate >= now;
                case 'past':
                    return aptDate < now;
                default:
                    return true;
            }
        });
    };

    const filteredAppointments = filterAppointments();

    return (
        <Container className="py-4">
            <h2 className="mb-4">My Appointments</h2>

            {successMessage && (
                <Alert variant="success" className="mb-4">
                    {successMessage}
                </Alert>
            )}

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Appointments</option>
                            <option value="upcoming">Upcoming Appointments</option>
                            <option value="past">Past Appointments</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {filteredAppointments.length === 0 ? (
                <Alert variant="info">
                    No appointments found.
                </Alert>
            ) : (
                <Row>
                    {filteredAppointments.map((appointment) => (
                        <Col md={6} lg={4} key={appointment._id} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h5 className="mb-1">{appointment.doctorName}</h5>
                                            <Badge bg={getStatusBadgeVariant(appointment.status)}>
                                                {appointment.status}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <FiCalendar className="me-2 text-primary" />
                                            <small>{formatDate(appointment.appointmentDate)}</small>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <FiDollarSign className="me-2 text-primary" />
                                            <small>Consultation Fee: ${appointment.consultationFee}</small>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <strong className="d-block mb-2">Reason for Visit:</strong>
                                        <p className="mb-2">{appointment.reason}</p>
                                    </div>

                                    {appointment.additionalNotes && (
                                        <div className="mb-3">
                                            <strong className="d-block mb-2">Additional Notes:</strong>
                                            <p className="mb-0 text-muted">{appointment.additionalNotes}</p>
                                        </div>
                                    )}

                                    {appointment.status === 'scheduled' && (
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-danger" size="sm">
                                                Cancel Appointment
                                            </Button>
                                            <Button variant="outline-primary" size="sm">
                                                Reschedule
                                            </Button>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default AppointmentsPage; 