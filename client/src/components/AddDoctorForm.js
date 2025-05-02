import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const AddDoctorForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    licenseNumber: '',
    consultationFee: '',
    hospital: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/doctors', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setSuccess(true);
      setError('');
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          password: '',
          specialization: '',
          licenseNumber: '',
          consultationFee: '',
          hospital: ''
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create doctor');
    }
  };

  return (
    <div className="mt-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Add New Doctor</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Doctor added successfully!</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Specialization</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.specialization}
            onChange={e => setFormData({...formData, specialization: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>License Number</Form.Label>
          <Form.Control
            type="text"
            required
            value={formData.licenseNumber}
            onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Consultation Fee (USD)</Form.Label>
          <Form.Control
            type="number"
            required
            value={formData.consultationFee}
            onChange={e => setFormData({...formData, consultationFee: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            type="text"
            value={formData.hospital}
            onChange={e => setFormData({...formData, hospital: e.target.value})}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Add Doctor
        </Button>
      </Form>
    </div>
  );
};

export default AddDoctorForm;