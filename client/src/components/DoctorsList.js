import { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert, Button, Form, InputGroup, Dropdown, Pagination } from 'react-bootstrap';
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown, FiStar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAllDoctors } from '../data/dummyDoctors';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(6);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Use dummy data instead of API call
        const dummyDoctors = getAllDoctors();
        setDoctors(dummyDoctors);
        setError('');
      } catch (err) {
        setError('Failed to load doctors. Please try again later.');
        console.error('Doctors fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Get unique specializations for filter dropdown
  const specializations = [...new Set(doctors.map(doctor => doctor.specialization))];

  // Filter and sort doctors
  const filteredDoctors = doctors
    .filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization = !specialization || doctor.specialization === specialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      } else if (sortBy === 'experience') {
        const expA = parseInt(a.experience);
        const expB = parseInt(b.experience);
        return sortOrder === 'asc' ? expA - expB : expB - expA;
      } else if (sortBy === 'consultationFee') {
        return sortOrder === 'asc' ? a.consultationFee - b.consultationFee : b.consultationFee - a.consultationFee;
      } else if (sortBy === 'rating') {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
      return 0;
    });

  // Pagination
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <h2 className="mb-4">Available Doctors</h2>

      {/* Search and Filter Bar */}
      <div className="mb-4">
        <Row>
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by name, specialization, or hospital"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="specialization-dropdown">
                <FiFilter className="me-1" />
                {specialization || 'All Specializations'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setSpecialization('')}>All Specializations</Dropdown.Item>
                {specializations.map(spec => (
                  <Dropdown.Item key={spec} onClick={() => setSpecialization(spec)}>
                    {spec}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={3}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="sort-dropdown">
                Sort by: {sortBy} {sortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { setSortBy('name'); setSortOrder('asc'); }}>Name (A-Z)</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('name'); setSortOrder('desc'); }}>Name (Z-A)</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('experience'); setSortOrder('desc'); }}>Experience (High-Low)</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('consultationFee'); setSortOrder('asc'); }}>Fee (Low-High)</Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortBy('rating'); setSortOrder('desc'); }}>Rating (High-Low)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>

      {/* Doctors Grid */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {currentDoctors.map(doctor => (
          <Col key={doctor._id}>
            <Card className="h-100">
              <Card.Img variant="top" src={doctor.image} alt={doctor.name} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{doctor.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{doctor.specialization}</Card.Subtitle>
                <div className="d-flex align-items-center mb-2">
                  <FiStar className="text-warning me-1" />
                  <span>{doctor.rating} ({doctor.totalReviews} reviews)</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FiDollarSign className="text-success me-1" />
                  <span>${doctor.consultationFee} consultation fee</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <FiMapPin className="text-primary me-1" />
                  <span>{doctor.hospital}, {doctor.location}</span>
                </div>
                <div className="d-flex align-items-center mb-3">
                  <FiClock className="text-info me-1" />
                  <span>{doctor.experience} experience</span>
                </div>
                <Button
                  as={Link}
                  to={`/doctors/${doctor._id}`}
                  variant="primary"
                  className="w-100"
                >
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      )}

      {currentDoctors.length === 0 && (
        <Alert variant="info" className="mt-4">
          No doctors found matching your criteria.
        </Alert>
      )}
    </div>
  );
};

export default DoctorsList;