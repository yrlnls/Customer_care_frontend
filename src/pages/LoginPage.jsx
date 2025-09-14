import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Container, Form, Alert, Spinner } from 'react-bootstrap';

function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

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
    if (result.success) {
      // Navigation will be handled by the auth context
      const user = JSON.parse(localStorage.getItem('user'));
      // Map user roles to correct route paths
      const roleRoutes = {
        'admin': '/admin/dashboard',
        'agent': '/agent/dashboard',
        'technician': '/tech/dashboard'
      };
      const dashboardRoute = roleRoutes[user.role] || '/login';
      navigate(dashboardRoute);
    } else {
      setError(result.error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '24rem' }} className="p-4">
        <Card.Body>
          <Card.Title className="text-center mb-4">Customer Care System</Card.Title>
          <Card.Subtitle className="mb-3 text-muted text-center">Please login to continue</Card.Subtitle>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit"
              className="w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>
          
          <div className="mt-3">
            <small className="text-muted">
              Demo credentials:<br/>
              Admin: admin@company.com / admin123<br/>
              Agent: sarah.johnson@company.com / agent123<br/>
              Tech: mike.wilson@company.com / tech123
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;