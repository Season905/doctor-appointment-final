/**
 * DoctorProfile Component
 * 
 * This component displays detailed information about a doctor, including:
 * - Basic profile information
 * - Professional details
 * - Available appointment slots
 * - Booking functionality
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { FiClock, FiDollarSign, FiMapPin, FiStar, FiAward, FiBookOpen } from 'react-icons/fi';
import { getDoctorById } from '../data/dummyDoctors';

const DoctorProfile = () => {
    // Get doctor ID from URL parameters
    const { id } = useParams();
    const navigate = useNavigate();

    // State management for doctor data and UI states
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch doctor data when component mounts or ID changes
    useEffect(() => {
        const fetchDoctor = () => {
            try {
                // Get doctor data from dummy database
                const doctorData = getDoctorById(id);
                if (doctorData) {
                    setDoctor(doctorData);
                } else {
                    setError('Doctor not found');
                }
            } catch (err) {
                console.error('Error fetching doctor:', err);
                setError('Failed to load doctor information');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [id]);

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    // Show error message if doctor not found or error occurred
    if (error || !doctor) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    {error || 'Doctor not found'}
                </Alert>
                <Button variant="primary" onClick={() => navigate('/doctors')}>
                    Back to Doctors List
                </Button>
            </Container>
        );
    }

    // Main profile view
    return (
        <Container className="py-4">
            {/* Navigation back button */}
            <Button variant="outline-primary" className="mb-4" onClick={() => navigate('/doctors')}>
                ← Back to Doctors List
            </Button>

            <Row>
                {/* Left column - Basic profile information */}
                <Col lg={4}>
                    {/* Profile card with image and basic info */}
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <img
                                src={doctor.image || '/default-avatar.png'}
                                alt={doctor.name}
                                className="rounded-circle mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h3>{doctor.name}</h3>
                            <p className="text-muted mb-3">{doctor.specialization}</p>
                            {/* Rating display */}
                            <div className="d-flex justify-content-center align-items-center mb-3">
                                <FiStar className="text-warning me-1" />
                                <span className="h5 mb-0">{doctor.rating}</span>
                                <span className="text-muted ms-2">({doctor.totalReviews}+ reviews)</span>
                            </div>
                            {/* Book appointment button */}
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-100"
                                onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                            >
                                Book Appointment
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Quick information card */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="mb-3">Quick Information</h5>
                            {/* Hospital and location */}
                            <div className="mb-3">
                                <FiMapPin className="me-2 text-primary" />
                                <strong>Hospital:</strong>
                                <p className="ms-4 mb-2">{doctor.hospital}</p>
                                <p className="ms-4 mb-2 text-muted">{doctor.location}</p>
                            </div>
                            {/* Experience */}
                            <div className="mb-3">
                                <FiClock className="me-2 text-primary" />
                                <strong>Experience:</strong>
                                <p className="ms-4 mb-2">{doctor.experience}</p>
                            </div>
                            {/* Consultation fee */}
                            <div className="mb-3">
                                <FiDollarSign className="me-2 text-primary" />
                                <strong>Consultation Fee:</strong>
                                <p className="ms-4 mb-2">${doctor.consultationFee}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right column - Detailed information */}
                <Col lg={8}>
                    {/* About doctor card */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h5 className="mb-3">About Doctor</h5>
                            <p>{doctor.about}</p>
                            {/* Education */}
                            <div className="mb-4">
                                <FiBookOpen className="me-2 text-primary" />
                                <strong>Education</strong>
                                <p className="ms-4 mb-2">{doctor.education}</p>
                            </div>
                            {/* Certifications */}
                            {doctor.certifications && doctor.certifications.length > 0 && (
                                <div className="mb-4">
                                    <FiAward className="me-2 text-primary" />
                                    <strong>Certifications</strong>
                                    <div className="ms-4">
                                        {doctor.certifications.map((cert, index) => (
                                            <Badge bg="light" text="dark" className="me-2 mb-2" key={index}>
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card.Body>
                    </Card>

                    {/* Available slots card */}
                    <Card>
                        <Card.Body>
                            <h5 className="mb-3">Available Slots</h5>
                            <Row className="g-3">
                                {doctor.availableSlots.map((slot, index) => {
                                    const date = new Date(slot);
                                    return (
                                        <Col md={4} key={index}>
                                            <Button
                                                variant="outline-primary"
                                                className="w-100"
                                                onClick={() => navigate(`/book-appointment/${doctor._id}?slot=${slot}`)}
                                            >
                                                {date.toLocaleDateString()} <br />
                                                {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Button>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DoctorProfile; 