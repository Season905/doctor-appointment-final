import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FiClock, FiDollarSign, FiCalendar, FiUser } from 'react-icons/fi';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { addAppointment } from '../data/dummyAppointments';
import { getDoctorById } from '../data/dummyDoctors';

const BookAppointmentPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSlot = searchParams.get('slot');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    patientName: user?.name || '',
    phone: '',
    email: user?.email || '',
    appointmentDate: selectedSlot || '',
    reason: '',
    additionalNotes: ''
  });

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const foundDoctor = getDoctorById(id);
        if (!foundDoctor) {
          throw new Error('Doctor not found');
        }
        setDoctor(foundDoctor);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor information');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add appointment to dummy data
      const appointmentData = {
        doctorId: id,
        doctorName: doctor.name,
        patientName: formData.patientName,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        appointmentDate: formData.appointmentDate,
        reason: formData.reason,
        additionalNotes: formData.additionalNotes,
        consultationFee: doctor.consultationFee
      };

      const newAppointment = addAppointment(appointmentData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments', {
          state: {
            message: 'Appointment booked successfully!',
            appointmentDetails: {
              doctor: doctor.name,
              date: formData.appointmentDate,
              reason: formData.reason,
              appointmentId: newAppointment._id
            }
          }
        });
      }, 2000);
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !doctor) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/doctors')}>
          Back to Doctors List
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container className="mt-4">
        <Alert variant="success">
          <Alert.Heading>Appointment Booked Successfully!</Alert.Heading>
          <p>
            You will receive a confirmation email shortly with the appointment details.
            Redirecting to your appointments...
          </p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button variant="outline-primary" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Row>
        <Col lg={4} className="mb-4">
          {doctor && (
            <Card>
              <Card.Body>
                <h5 className="mb-3">Appointment Summary</h5>
                <div className="mb-3">
                  <FiUser className="me-2 text-primary" />
                  <strong>Doctor:</strong>
                  <p className="ms-4 mb-2">{doctor.name}</p>
                  <p className="ms-4 mb-2 text-muted">{doctor.specialization}</p>
                </div>
                <div className="mb-3">
                  <FiDollarSign className="me-2 text-primary" />
                  <strong>Consultation Fee:</strong>
                  <p className="ms-4 mb-2">${doctor.consultationFee}</p>
                </div>
                {selectedSlot && (
                  <div className="mb-3">
                    <FiCalendar className="me-2 text-primary" />
                    <strong>Selected Slot:</strong>
                    <p className="ms-4 mb-2">
                      {new Date(selectedSlot).toLocaleDateString()} <br />
                      {new Date(selectedSlot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <h4 className="mb-4">Book Appointment</h4>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Patient Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                {!selectedSlot && (
                  <Form.Group className="mb-3">
                    <Form.Label>Preferred Date & Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="appointmentDate"
                      value={formData.appointmentDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Reason for Visit</Form.Label>
                  <Form.Control
                    as="select"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a reason</option>
                    <option value="Consultation">General Consultation</option>
                    <option value="Follow-up">Follow-up Visit</option>
                    <option value="New Symptoms">New Symptoms</option>
                    <option value="Routine Checkup">Routine Checkup</option>
                    <option value="Test Results">Test Results Review</option>
                    <option value="Other">Other</option>
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Additional Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any specific concerns or information you'd like to share with the doctor"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Booking Appointment...
                    </>
                  ) : (
                    'Confirm Appointment'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointmentPage;