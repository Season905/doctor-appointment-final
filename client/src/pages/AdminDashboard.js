import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Alert } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import DoctorManagementForm from '../components/DoctorManagementForm';
import api from '../api';

const AdminDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const fetchDoctors = async () => {
        try {
            const response = await api.get('/doctors');
            setDoctors(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch doctors');
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleAddDoctor = () => {
        setSelectedDoctor(null);
        setModalMode('add');
        setShowModal(true);
    };

    const handleEditDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setModalMode('edit');
        setShowModal(true);
    };

    const handleDeleteDoctor = async (doctorId) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await api.delete(`/doctors/${doctorId}`);
                setDoctors(doctors.filter(doctor => doctor._id !== doctorId));
            } catch (err) {
                setError('Failed to delete doctor');
                console.error('Error deleting doctor:', err);
            }
        }
    };

    const handleFormSuccess = () => {
        setShowModal(false);
        fetchDoctors();
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Doctor Management</h2>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleAddDoctor}>
                        <FiPlus className="me-2" />
                        Add New Doctor
                    </Button>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}

            <Card>
                <Card.Body>
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Hospital</th>
                                <th>Experience</th>
                                <th>Consultation Fee</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map(doctor => (
                                <tr key={doctor._id}>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.specialization}</td>
                                    <td>{doctor.hospital}</td>
                                    <td>{doctor.experience} years</td>
                                    <td>${doctor.consultationFee}</td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleEditDoctor(doctor)}
                                        >
                                            <FiEdit2 />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteDoctor(doctor._id)}
                                        >
                                            <FiTrash2 />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {doctors.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No doctors found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DoctorManagementForm
                        doctor={selectedDoctor}
                        mode={modalMode}
                        onSuccess={handleFormSuccess}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AdminDashboard; 