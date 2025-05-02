import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import api from '../api';

const DoctorManagementForm = ({ doctor, onSuccess, mode = 'add' }) => {
    const [formData, setFormData] = useState({
        name: doctor?.name || '',
        email: doctor?.email || '',
        password: '',
        specialization: doctor?.specialization || '',
        education: doctor?.education || '',
        experience: doctor?.experience || '',
        certifications: doctor?.certifications || '',
        hospital: doctor?.hospital || '',
        consultationFee: doctor?.consultationFee || '',
        licenseNumber: doctor?.licenseNumber || ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
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
            if (mode === 'add') {
                await api.post('/doctors', formData);
            } else {
                await api.put(`/doctors/${doctor._id}`, formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save doctor information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 border rounded">
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={mode === 'edit'}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {mode === 'add' && (
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={mode === 'add'}
                    />
                </Form.Group>
            )}

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Specialization</Form.Label>
                        <Form.Control
                            type="text"
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Hospital</Form.Label>
                        <Form.Control
                            type="text"
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Education</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Experience (in years)</Form.Label>
                <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Certifications</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="Enter certifications separated by commas"
                />
            </Form.Group>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Consultation Fee</Form.Label>
                        <Form.Control
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>License Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="licenseNumber"
                            value={formData.licenseNumber}
                            onChange={handleChange}
                            required
                            pattern="[A-Z]{3}-\d{6}"
                            title="Format: ABC-123456"
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100"
            >
                {loading ? 'Saving...' : mode === 'add' ? 'Add Doctor' : 'Update Doctor'}
            </Button>
        </Form>
    );
};

export default DoctorManagementForm; 