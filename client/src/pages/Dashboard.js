import '../styles/dashboard.css';
import { useEffect, useState } from 'react';
import { 
  Container, Row, Col, Card, ListGroup, 
  Spinner, Alert, Button, Badge
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Calendar, BarChart, UserCheck, Activity } from 'react-feather';
import api from '../api';
import { format, parseISO } from 'date-fns';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    user: null,
    appointments: [],
    stats: {
      totalAppointments: 0,
      upcomingAppointments: 0,
      completedAppointments: 0,
      totalPatients: 0,
      availableDoctors: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchDashboardData = async () => {
    try {
      const [userRes, appointmentsRes, statsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/appointments?limit=5&sort=-date'),
        api.get('/stats/dashboard')
      ]);

      const appointmentsData = Array.isArray(appointmentsRes?.data?.data) 
        ? appointmentsRes.data.data 
        : [];

      // 2. Add data validation for numeric stats
      setDashboardData({
        user: userRes.data,
        appointments: appointmentsData,
        stats: {
          totalAppointments: Number(statsRes.data?.totalAppointments) || 0,
          upcomingAppointments: Number(statsRes.data?.upcomingAppointments) || 0,
          completedAppointments: Number(statsRes.data?.completedAppointments) || 0,
          totalPatients: Number(statsRes.data?.totalPatients) || 0,
          availableDoctors: Number(statsRes.data?.availableDoctors) || 0
        }
      });
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Dashboard Error:', err);
      setDashboardData(prev => ({
        ...prev,
        appointments: [],
        stats: {
          totalAppointments: 0,
          upcomingAppointments: 0,
          completedAppointments: 0,
          totalPatients: 0,
          availableDoctors: 0
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError('');
    fetchDashboardData();
  };

  // 4. Enhanced chart options with validation
  const chartOptions = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Appointments', 'Patients', 'Doctors', 'Completed'],
        type: 'category' // Explicit type definition
      },
      yaxis: {
        title: { text: 'Count' }, // Y-axis label
        min: 0 // Ensure minimum value
      },
      colors: ['#4a90e2', '#7ed321', '#f8e71c', '#d0021b'],
    },
    series: [{
      name: 'Stats',
      data: [
        dashboardData.stats.totalAppointments || 0,
        dashboardData.stats.totalPatients || 0,
        dashboardData.stats.availableDoctors || 0,
        dashboardData.stats.completedAppointments || 0
      ].map(Number) // Ensure all values are numbers
    }]
  };

  const renderAppointmentBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', text: 'Pending' },
      confirmed: { color: 'success', text: 'Confirmed' },
      completed: { color: 'primary', text: 'Completed' },
      cancelled: { color: 'danger', text: 'Cancelled' }
    };
    
    const { color, text } = statusConfig[status] || { color: 'secondary', text: 'Unknown' };
    return <Badge bg={color} className="ms-2">{text}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={handleRefresh}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header mb-4">
        <h2>Welcome back, {dashboardData.user?.name}</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={handleRefresh}>
            Refresh Data
          </Button>
          {dashboardData.user?.role === 'admin' && (
            <Button variant="outline-info" size="sm" as={Link} to="/admin">
              Admin Panel
            </Button>
          )}
        </div>
      </div>

      <Row className="g-4 mb-4">
        <Col xl={3} lg={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-primary">
                  <Calendar size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Total Appointments</h6>
                  <h3 className="mb-0">{dashboardData.stats.totalAppointments}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-success">
                  <UserCheck size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Active Patients</h6>
                  <h3 className="mb-0">{dashboardData.stats.totalPatients}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-warning">
                  <Activity size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Available Doctors</h6>
                  <h3 className="mb-0">{dashboardData.stats.availableDoctors}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} lg={6}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-info">
                  <BarChart size={24} />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Completed</h6>
                  <h3 className="mb-0">{dashboardData.stats.completedAppointments}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col xl={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Appointments Overview</h5>
              <div className="d-flex gap-2">
                {['upcoming', 'completed', 'all'].map(tab => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                ))}
              </div>
            </Card.Header>
            <Card.Body>
              {/* 4. Add chart rendering safety check */}
              {dashboardData.stats.totalAppointments >= 0 && (
                <Chart
                  options={chartOptions.options}
                  series={chartOptions.series}
                  type="bar"
                  height={350}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Recent Appointments</h5>
            </Card.Header>
            <ListGroup variant="flush">
              {dashboardData.appointments.map(appointment => (
                <ListGroup.Item key={appointment._id} className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">
                        {format(parseISO(appointment.date), 'MMM dd, yyyy - hh:mm a')}
                      </div>
                      <small className="text-muted">
                        Dr. {appointment.doctor?.name} ({appointment.doctor?.specialization})
                      </small>
                    </div>
                    {renderAppointmentBadge(appointment.status)}
                  </div>
                </ListGroup.Item>
              ))}
              {dashboardData.appointments.length === 0 && (
                <ListGroup.Item className="text-center text-muted py-4">
                  No appointments found
                </ListGroup.Item>
              )}
            </ListGroup>
            <Card.Footer className="text-center">
              <Button variant="link" as={Link} to="/appointments">
                View All Appointments
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;