import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Admin Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/doctors">Doctors</Nav.Link>
                <Nav.Link as={Link} to="/users">Users</Nav.Link>
              </Nav>
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar; 