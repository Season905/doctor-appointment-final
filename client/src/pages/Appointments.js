import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Appointments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      navigate('/login');
      return;
    }

    console.log('User authenticated:', user);
    fetchAppointments();

    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state, isAuthenticated, user, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');

      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to view appointments');
        navigate('/login');
        return;
      }

      console.log('Fetching appointments with token:', token);
      const response = await api.get('/appointments');
      console.log('Raw appointments response:', response);

      if (!response.data) {
        throw new Error('No data received from server');
      }

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch appointments');
      }

      if (!Array.isArray(response.data.data)) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }

      console.log('Appointments loaded:', response.data.data);
      setAppointments(response.data.data);

      if (response.data.data.length === 0) {
        console.log('No appointments found');
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError(err.response.data.error || 'No appointments found');
      } else {
        setError(err.message || err.response?.data?.error || 'Failed to load appointments. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
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
    try {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Invalid date';
    }
  };

  const filterAppointments = () => {
    const now = new Date();
    return appointments.filter(apt => {
      try {
        const aptDate = new Date(apt.date);
        switch (filter) {
          case 'upcoming':
            return aptDate >= now;
          case 'past':
            return aptDate < now;
          default:
            return true;
        }
      } catch (err) {
        console.error('Error filtering appointment:', err);
        return false;
      }
    });
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/cancel`);
      setSuccessMessage('Appointment cancelled successfully');
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    }
  };

  const filteredAppointments = filterAppointments();

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Appointments</h2>

      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
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
        <Row>
          {filteredAppointments.map((appointment) => (
            <Col md={6} lg={4} key={appointment._id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Appointment Details</h5>
                    <Badge bg={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status || 'Unknown'}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mb-4">
                    <h6 className="text-primary mb-3">
                      <FiUser className="me-2" />
                      Doctor Information
                    </h6>
                    <div className="ms-4">
                      <p className="mb-1">
                        <strong>Name:</strong> {appointment.doctor?.name || 'Unknown Doctor'}
                      </p>
                      <p className="mb-1">
                        <strong>Specialization:</strong> {appointment.doctor?.specialization || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h6 className="text-primary mb-3">
                      <FiCalendar className="me-2" />
                      Appointment Time
                    </h6>
                    <div className="ms-4">
                      <p className="mb-1">
                        <strong>Date:</strong> {formatDate(appointment.date)}
                      </p>
                      <p className="mb-1">
                        <strong>Time:</strong> {new Date(appointment.date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mb-3">
                      <h6 className="text-primary mb-3">
                        <FiClock className="me-2" />
                        Additional Notes
                      </h6>
                      <div className="ms-4">
                        <p className="mb-0">{appointment.notes}</p>
                      </div>
                    </div>
                  )}

                  {appointment.status === 'scheduled' && (
                    <div className="d-flex gap-2 mt-3">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        Cancel Appointment
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/appointments/${appointment._id}/reschedule`)}
                      >
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

export default Appointments;  