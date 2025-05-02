import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (role && user.role !== role) {
      console.warn(`Unauthorized access attempt by ${user.role} user`);
      // Redirect to appropriate dashboard based on user role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      return;
    }
  }, [user, navigate, role]);

  if (!user) {
    return null;
  }

  if (role && user.role !== role) {
    return null;
  }

  return children;
};

export default ProtectedRoute;