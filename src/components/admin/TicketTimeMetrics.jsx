import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Row, Col } from 'react-bootstrap';

function TicketTimeMetrics() {
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    // Mock data with time taken information
    const mockTicketTimeData = [
      {
        id: 1,
        ticketId: "TCK-2025-001",
        title: "Internet Connection Issue",
        technician: "Michael Johnson",
        client: "John Smith",
        priority: "high",
        status: "completed",
        createdAt: "2025-08-01 09:30",
        startedAt: "2025-08-01 10:15",
        completedAt: "2025-08-01 14:45",
        timeTaken: "4h 30m",
        timeTakenMinutes: 270,
        estimatedTime: "3h 00m",
        estimatedMinutes: 180,
        efficiency: "150%", // Actual vs estimated
        category: "Network Issue"
      },
      {
        id: 2,
        ticketId: "TCK-2025-002",
        title: "Router Configuration",
        technician: "Emily Chen",
        client: "Sarah Williams",
        priority: "medium",
        status: "completed",
        createdAt: "2025-08-03 11:00",
        startedAt: "2025-08-03 13:30",
        completedAt: "2025-08-03 15:15",
        timeTaken: "1h 45m",
        timeTakenMinutes: 105,
        estimatedTime: "2h 00m",
        estimatedMinutes: 120,
        efficiency: "87.5%",
        category: "Configuration"
      },
      {
        id: 3,
        ticketId: "TCK-2025-003",
        title: "Slow Internet Speed",
        technician: "David Kim",
        client: "Robert Davis",
        priority: "critical",
        status: "completed",
        createdAt: "2025-08-05 08:00",
        startedAt: "2025-08-05 08:30",
        completedAt: "2025-08-05 11:00",
        timeTaken: "2h 30m",
        timeTakenMinutes: 150,
        estimatedTime: "2h 30m",
        estimatedMinutes: 150,
        efficiency: "100%",
        category: "Performance Issue"
      },
      {
        id: 4,
        ticketId: "TCK-2025-004",
        title: "WiFi Signal Weak",
        technician: "Michael Johnson",
        client: "Alice Cooper",
        priority: "medium",
        status: "completed",
        createdAt: "2025-08-06 14:00",
        startedAt: "2025-08-06 15:00",
        completedAt: "2025-08-06 17:30",
        timeTaken: "2h 30m",
        timeTakenMinutes: 150,
        estimatedTime: "2h 00m",
        estimatedMinutes: 120,
        efficiency: "125%",
        category: "Signal Issue"
      },
      {
        id: 5,
        ticketId: "TCK-2025-005",
        title: "DNS Configuration",
        technician: "Emily Chen",
        client: "Bob Wilson",
        priority: "low",
        status: "in-progress",
        createdAt: "2025-08-07 10:00",
        startedAt: "2025-08-07 10:30",
        completedAt: null,
        timeTaken: "1h 15m (ongoing)",
        timeTakenMinutes: 75,
        estimatedTime: "1h 30m",
        estimatedMinutes: 90,
        efficiency: "83%",
        category: "DNS Issue"
      }
    ];

    setTicketData(mockTicketTimeData);
  }, []);

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'critical': return <Badge bg="danger">Critical</Badge>;
      case 'high': return <Badge bg="warning">High</Badge>;
      case 'medium': return <Badge bg="info">Medium</Badge>;
      case 'low': return <Badge bg="success">Low</Badge>;
      default: return <Badge bg="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <Badge bg="success">Completed</Badge>;
      case 'in-progress': return <Badge bg="primary">In Progress</Badge>;
      case 'pending': return <Badge bg="warning">Pending</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getEfficiencyColor = (efficiency) => {
    const value = parseFloat(efficiency);
    if (value >= 100) return 'text-success';
    if (value >= 80) return 'text-warning';
    return 'text-danger';
  };

  // Calculate summary statistics
  const completedTickets = ticketData.filter(ticket => ticket.status === 'completed');
  const totalTimeTaken = completedTickets.reduce((sum, ticket) => sum + ticket.timeTakenMinutes, 0);
  const avgTimeTaken = completedTickets.length > 0 ? Math.round(totalTimeTaken / completedTickets.length) : 0;
  const avgEfficiency = completedTickets.length > 0 
    ? (completedTickets.reduce((sum, ticket) => sum + parseFloat(ticket.efficiency), 0) / completedTickets.length).toFixed(1)
    : 0;

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Completed</Card.Title>
              <Card.Text className="h4">{completedTickets.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Avg Time Taken</Card.Title>
              <Card.Text className="h4">{Math.floor(avgTimeTaken / 60)}h {avgTimeTaken % 60}m</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Avg Efficiency</Card.Title>
              <Card.Text className="h4">{avgEfficiency}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Hours</Card.Title>
              <Card.Text className="h4">{Math.round(totalTimeTaken / 60)}h</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">Detailed Ticket Time Metrics</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Technician</th>
                <th>Client</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Time Taken</th>
                <th>Estimated</th>
                <th>Efficiency</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {ticketData.map(ticket => (
                <tr key={ticket.id}>
                  <td><strong>{ticket.ticketId}</strong></td>
                  <td>{ticket.title}</td>
                  <td>{ticket.technician}</td>
                  <td>{ticket.client}</td>
                  <td>{getPriorityBadge(ticket.priority)}</td>
                  <td>{getStatusBadge(ticket.status)}</td>
                  <td><strong>{ticket.timeTaken}</strong></td>
                  <td>{ticket.estimatedTime}</td>
                  <td className={getEfficiencyColor(ticket.efficiency)}>
                    <strong>{ticket.efficiency}</strong>
                  </td>
                  <td>{ticket.category}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default TicketTimeMetrics;
