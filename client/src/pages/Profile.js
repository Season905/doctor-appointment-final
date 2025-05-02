import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Alert, Spinner, Button, Card, Row, Col } from 'react-bootstrap';
import ProfilePicture from '../components/ProfilePicture';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me');
        setProfileData(data.data);
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError('Failed to load profile data. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleProfilePictureUpdate = (newPictureUrl) => {
    setProfileData(prev => ({
      ...prev,
      profilePicture: newPictureUrl
    }));
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Profile</h2>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      {profileData && (
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <ProfilePicture
                  profileData={profileData}
                  onUpdate={handleProfilePictureUpdate}
                />
                <div className="text-center">
                  <h4>{profileData.name}</h4>
                  <p className="text-muted">{profileData.role}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>Profile Information</Card.Title>
                <Card.Text>
                  <div className="mb-3">
                    <strong>Email:</strong> {profileData.email}
                  </div>
                  {profileData.phone && (
                    <div className="mb-3">
                      <strong>Phone:</strong> {profileData.phone}
                    </div>
                  )}
                  {profileData.address && (
                    <div className="mb-3">
                      <strong>Address:</strong> {profileData.address}
                    </div>
                  )}
                  {profileData.specialization && (
                    <div className="mb-3">
                      <strong>Specialization:</strong> {profileData.specialization}
                    </div>
                  )}
                  <div className="mb-3">
                    <strong>Member since:</strong> {new Date(profileData.createdAt).toLocaleDateString()}
                  </div>
                </Card.Text>
                <Button variant="primary">
                  Edit Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Profile;