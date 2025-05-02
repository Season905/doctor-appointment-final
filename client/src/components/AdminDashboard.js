import React, { useState, useEffect } from 'react';
import { Container, Tabs, Tab, Table, Button } from 'react-bootstrap';
import AddDoctorForm from './AddDoctorForm';
import api from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await api.get('/admin/users');
        const doctorsRes = await api.get('/doctors');
        setUsers(usersRes.data);
        setDoctors(doctorsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Admin Dashboard</h2>
      
      <Tabs defaultActiveKey="users" className="mb-3">
        <Tab eventKey="users" title="Manage Users">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="doctors" title="Manage Doctors">
          <AddDoctorForm />
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>License Number</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doctor => (
                <tr key={doctor._id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.licenseNumber}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;