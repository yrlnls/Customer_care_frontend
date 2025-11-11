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
    <Navbar bg="primary" expand="lg" className="mb-0 px-2 px-lg-4 sticky-top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="me-auto fw-bold">
          <i className="bi bi-headset me-2"></i>
          <span className="d-none d-sm-inline">Customer Care System</span>
          <span className="d-inline d-sm-none">CCS</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="flex-column flex-lg-row">
            {userRole && (
              <>
                <Nav.Link as={Link} to={`/${userRole}/dashboard`} className="mx-lg-2 py-2">
                  <i className="bi bi-speedometer2 me-2"></i>
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/map" className="mx-lg-2 py-2">
                  <i className="bi bi-geo-alt me-2"></i>
                  Map
                </Nav.Link>
              </>
            )}
            {userRole === 'admin' && (
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-gear me-2"></i>
                    <span className="d-lg-none">Admin Menu</span>
                    <span className="d-none d-lg-inline">Admin</span>
                  </span>
                } 
                id="admin-dropdown"
                className="mx-lg-2"
                menuVariant="dark"
              >
                <NavDropdown.Item as={Link} to="/admin/manage-users">
                  <i className="bi bi-people me-2"></i>
                  Manage Users
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/sites">
                  <i className="bi bi-geo-alt me-2"></i>
                  Sites Management
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/routers">
                  <i className="bi bi-router me-2"></i>
                  Router Management
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/admin/system-settings">
                  <i className="bi bi-sliders me-2"></i>
                  System Settings
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/view-reports">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  View Reports
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/technician-metrics">
                  <i className="bi bi-graph-up me-2"></i>
                  Technician Metrics
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {userRole && (
              <Button 
                variant="outline-light" 
                onClick={handleLogout} 
                className="ms-lg-2 mt-2 mt-lg-0"
                size="sm"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
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
