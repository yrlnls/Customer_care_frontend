import React from 'react';
import { Container, Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CustomNavbar() {
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" expand="lg" className="mb- px-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto">
          Customer Care System
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {userRole && (
              <>
                <Nav.Link as={Link} to={`/${userRole}/dashboard`} className="mx-2">
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/map" className="mx-2">
                  Map
                </Nav.Link>
              </>
            )}
            {userRole === 'admin' && (
              <>
                <Nav.Link 
                  as={Link}
                  to="/admin/manage-users"
                  className="mx-2 text-white"
                >
                  Manage Users
                </Nav.Link>
                <Nav.Link 
                  as={Link}
                  to="/admin/sites"
                  className="mx-2 text-white"
                >
                  Sites Management
                </Nav.Link>
                <Nav.Link 
                  as={Link}
                  to="/admin/system-settings"
                  className="mx-2 text-white"
                >
                  System Settings
                </Nav.Link>
                <Nav.Link 
                  as={Link}
                  to="/admin/view-reports"
                  className="mx-2 text-white"
                >
                  View Reports
                </Nav.Link>
                <Nav.Link 
                  as={Link}
                  to="/admin/technician-metrics"
                  className="mx-2 text-white"
                >
                  Technician Metrics
                </Nav.Link>
              </>
            )}
            {userRole && (
              <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
