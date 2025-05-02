import { useContext, lazy, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import BookAppointmentPage from './pages/BookAppointmentPage';
import { AuthContext } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
// Lazy-loaded pages with explicit default exports
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Appointments = lazy(() => import('./pages/Appointments'));
const DoctorList = lazy(() => import('./pages/DoctorList'));
const DoctorProfile = lazy(() => import('./pages/DoctorProfile'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
const DoctorAvailability = lazy(() => import('./pages/DoctorAvailability'));
const AddDoctorForm = lazy(() => import('./components/AddDoctorForm'));

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className="container py-4">
      <ScrollToTop />
      <PageTransition>
        {children}
      </PageTransition>
    </main>
  </>
);

function App() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <Suspense fallback={<Loader fullScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorList />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <BookAppointmentPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-availability"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorAvailability />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-doctor"
          element={
            <ProtectedRoute>
              <Layout>
                <AddDoctorForm />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;