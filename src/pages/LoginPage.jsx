import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password');
      return;
    }

    const result = await login(credentials);
    if (result.success && result.user) {
      // Use user data directly from login result
      const userData = result.user;
      
      // Map user roles to correct route paths
      const roleRoutes = {
        'admin': '/admin/dashboard',
        'agent': '/agent/dashboard',
        'technician': '/tech/dashboard'
      };
      const dashboardRoute = roleRoutes[userData.role] || '/login';
      navigate(dashboardRoute);
    } else if (result.success) {
      // Fallback to localStorage if user data not in result
      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData && userData.role) {
        const roleRoutes = {
          'admin': '/admin/dashboard',
          'agent': '/agent/dashboard',
          'technician': '/tech/dashboard'
        };
        const dashboardRoute = roleRoutes[userData.role] || '/login';
        navigate(dashboardRoute);
      } else {
        setError('Login successful but user data not available. Please refresh the page.');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4 glow-text">Customer Care System</h2>
        <p className="mb-3 text-secondary text-center">Please login to continue</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-3">
          <small className="text-secondary">
            Demo credentials:<br/>
            Admin: admin@company.com / admin123<br/>
            Agent: sarah.johnson@company.com / agent123<br/>
            Tech: mike.wilson@company.com / tech123
          </small>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
