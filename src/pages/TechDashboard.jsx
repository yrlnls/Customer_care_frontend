import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TechnicianTickets from '../components/tech/TechnicianTickets';
import LeaveManagement from '../components/tech/LeaveManagement';
import { Alert, Spinner } from 'react-bootstrap';
import { ticketsAPI, clientsAPI } from '../services/api';

function TechDashboardContent() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ticketsResponse, clientsResponse] = await Promise.all([
          ticketsAPI.getAll(),
          clientsAPI.getAll()
        ]);
        setTickets(ticketsResponse.data.tickets || []);
        setClients(clientsResponse.data.clients || []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const currentTechId = user?.id;

  const assignedTickets = tickets.filter(ticket => ticket.assigned_tech_id === currentTechId);

  const enhancedTickets = assignedTickets.map(ticket => ({
    ...ticket,
    clientName: clients.find(client => client.id === ticket.client_id)?.name || 'Unknown Client'
  }));

  const handleUpdateTicket = async (ticketId, ticketData) => {
    try {
      await ticketsAPI.update(ticketId, ticketData);
      const response = await ticketsAPI.getAll();
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('Failed to update ticket');
    }
  };

  const refreshTickets = async () => {
    try {
      const response = await ticketsAPI.getAll();
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Error refreshing tickets:', error);
      setError('Failed to refresh tickets');
    }
  };

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
        <h1>Technician Dashboard</h1>
        <div>
          <span className="text-muted">Welcome, {user?.name || 'Technician'}</span>
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <TechnicianTickets
            tickets={enhancedTickets}
            updateTicket={handleUpdateTicket}
            refreshTickets={refreshTickets}
          />
        </div>
        <div className="col-lg-4">
          <LeaveManagement />
        </div>
      </div>
    </div>
  );
}

function TechDashboard() {
  return (
    <TechDashboardContent />
  );
}

export default TechDashboard;
