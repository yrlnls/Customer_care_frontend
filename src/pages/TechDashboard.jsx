import React, { useEffect, useState } from 'react';
import { Spinner, Alert, Card, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import TicketList from '../components/admin/TicketList.jsx';
import LeaveManagement from '../components/tech/LeaveManagement';
import { ticketsAPI, clientsAPI } from '../services/api';

function TechDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsResponse, clientsResponse] = await Promise.all([
          ticketsAPI.getAll(),
          clientsAPI.getAll(),
        ]);

        setTickets(ticketsResponse.data.tickets || []);
        setClients(clientsResponse.data.clients || []);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshTickets = async () => {
    try {
      const response = await ticketsAPI.getAll();
      setTickets(response.data.tickets || []);
    } catch (err) {
      console.error('Error refreshing tickets:', err);
      setError('Failed to refresh tickets');
    }
  };

  const handleUpdateTicket = async (ticketId, ticketData) => {
    try {
      await ticketsAPI.update(ticketId, ticketData);
      refreshTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('Failed to update ticket');
    }
  };

  const enhancedTickets = tickets.map(ticket => ({
    ...ticket,
    clientName: clients.find(client => client.id === ticket.client_id)?.name || 'Unknown Client',
  }));

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Technician Dashboard</h2>
        <span className="text-muted">Welcome, {user?.name || 'Technician'}</span>
      </div>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="management-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">All Tickets</h5>
              <Button variant="outline-primary" size="sm" onClick={refreshTickets}>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              <TicketList
                tickets={enhancedTickets}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleUpdateTicket}
                onDelete={null} // Technicians can’t delete tickets
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Leave Management</h5>
            </Card.Header>
            <Card.Body>
              <LeaveManagement />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default TechDashboard;
