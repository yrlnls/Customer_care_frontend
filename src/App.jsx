import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { MetricsProvider } from './context/MetricsContext';
import AppNavbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AgentDashboard from './pages/AgentDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import TechDashboard from './pages/TechDashboard.jsx';
import ManageUsersPage from './pages/ManageUsersPage.jsx';
import ViewReportsPage from './pages/ViewReportsPage.jsx';
import SystemSettingsPage from './pages/SystemSettingsPage.jsx';
import TechnicianMetricsPage from './pages/TechnicianMetricsPage.jsx';
import MapComponent from './components/MapComponent.jsx';
import SitesManagementPage from './pages/SitesManagementPage.jsx';

// ProtectedRoute component to handle role-based access
function ProtectedRoute({ role, children }) {
  const { userRole } = useAuth();
  
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }
  
  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AdminDashboardWrapper() {
  const navigate = useNavigate();

  const handleManageUsers = () => {
    navigate('/admin/manage-users');
  };

  const handleViewReports = () => {
    navigate('/admin/view-reports');
  };

  const handleSystemSettings = () => {
    navigate('/admin/system-settings');
  };

  return (
    <AdminDashboard
      onManageUsers={handleManageUsers}
      onViewReports={handleViewReports}
      onSystemSettings={handleSystemSettings}
    />
  );
}

function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && <AppNavbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/agent/dashboard" element={
          <ProtectedRoute role="agent">
            <AgentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboardWrapper />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/manage-users" element={
          <ProtectedRoute role="admin">
            <ManageUsersPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/view-reports" element={
          <ProtectedRoute role="admin">
            <ViewReportsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/system-settings" element={
          <ProtectedRoute role="admin">
            <SystemSettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/technician-metrics" element={
          <ProtectedRoute role="admin">
            <TechnicianMetricsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/tech/dashboard" element={
          <ProtectedRoute role="technician">
            <TechDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/map" element={
          <ProtectedRoute role={null}>
            <MapComponent />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/sites" element={
          <ProtectedRoute role="admin">
            <SitesManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="/tech/sites" element={
          <ProtectedRoute role="technician">
            <SitesManagementPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <MetricsProvider>
        <AuthProvider>
          <Layout />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </MetricsProvider>
    </Router>
  );
}

export default App;
