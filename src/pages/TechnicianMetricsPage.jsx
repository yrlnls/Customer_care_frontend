import React, { useState } from 'react';
import { Container, Card, Row, Col, Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import EmployeePerformance from '../components/admin/EmployeePerformance';
import TicketTimeMetrics from '../components/admin/TicketTimeMetrics';

function TechnicianMetricsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Technician Metrics</h2>
            <Button 
              variant="secondary" 
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
          </div>
        </Col>
      </Row>

      <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Nav.Item>
          <Nav.Link eventKey="overview">Overview</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="time-metrics">Time Metrics</Nav.Link>
        </Nav.Item>
      </Nav>

      {activeTab === 'overview' && (
        <>
          <Row>
            <Col md={12}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Technician Performance Overview</h5>
                </Card.Header>
                <Card.Body>
                  <EmployeePerformance />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Key Performance Indicators</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Average Resolution Time:</span>
                    <strong>2.5 hours</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Customer Satisfaction:</span>
                    <strong>94%</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>On-time Completion:</span>
                    <strong>87%</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Active Technicians:</span>
                    <strong>8</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={6}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Monthly Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Total Tickets Completed:</span>
                    <strong>342</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Average Tickets per Tech:</span>
                    <strong>42.75</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Escalation Rate:</span>
                    <strong>5.2%</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>First Contact Resolution:</span>
                    <strong>78%</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {activeTab === 'time-metrics' && (
        <TicketTimeMetrics />
      )}
    </Container>
  );
}

export default TechnicianMetricsPage;
