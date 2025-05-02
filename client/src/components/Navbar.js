import { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown, Spinner, Modal, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPlusCircle, FiUserPlus, FiSettings, FiCalendar, FiUsers, FiLogOut } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';

const Navigation = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand className="d-flex align-items-center">
            <span className="me-2">🏥</span>
            <span className="fw-bold">GoDoc</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Spinner animation="border" size="sm" role="status" />
            <span className="ms-2 text-muted small">Loading session...</span>
          </div>
        </Container>
      </Navbar>
    );
  }

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm mb-4" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="me-2">🏥</span>
            <span className="fw-bold">GoDoc</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-nav" />

          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto" activeKey={location.pathname}>
              <Nav.Link
                as={Link}
                to="/appointments"
                className={`mx-2 ${isActive('/appointments') ? 'active-link' : ''}`}
              >
                <FiCalendar className="me-1" />
                Appointments
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/doctors"
                className={`mx-2 ${isActive('/doctors') ? 'active-link' : ''}`}
              >
                <FiUsers className="me-1" />
                Doctors
              </Nav.Link>

              {user?.role === 'admin' && (
                <NavDropdown
                  title={
                    <>
                      <MdAdminPanelSettings className="me-1" />
                      Admin
                    </>
                  }
                  id="admin-dropdown"
                  className="mx-2"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/dashboard"
                    className={isActive('/admin/dashboard') ? 'active-dropdown-item' : ''}
                  >
                    <FiSettings className="me-2" />
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/doctors"
                    className={isActive('/admin/doctors') ? 'active-dropdown-item' : ''}
                  >
                    <FiUsers className="me-2" />
                    Manage Doctors
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/doctors/add"
                    className={isActive('/admin/doctors/add') ? 'active-dropdown-item' : ''}
                  >
                    <FiUserPlus className="me-2" />
                    Add Doctor
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {user?.role === 'doctor' && (
                <Nav.Link
                  as={Link}
                  to="/doctor/availability"
                  className={`mx-2 ${isActive('/doctor/availability') ? 'active-link' : ''}`}
                >
                  <FiPlusCircle className="me-1" />
                  Availability
                </Nav.Link>
              )}
            </Nav>

            <Nav className="ms-auto">
              {user ? (
                <NavDropdown
                  title={
                    <div className="d-inline-flex align-items-center">
                      <span className="me-2">👤</span>
                      {user.name}
                    </div>
                  }
                  align="end"
                  id="user-dropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/profile"
                    className={isActive('/profile') ? 'active-dropdown-item' : ''}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() => setShowLogoutModal(true)}
                    className="text-danger"
                  >
                    <FiLogOut className="me-2" />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    className="px-4"
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    className="px-4"
                  >
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out of your account?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navigation;