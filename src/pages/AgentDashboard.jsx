import React, { useState, useEffect } from 'react';
import { Button, Tabs, Tab, Row, Col, Spinner, Alert } from 'react-bootstrap';
import TicketForm from '../components/agent/TicketForm';
import ClientForm from '../components/agent/ClientForm';
import ClientsTable from '../components/agent/ClientsTable';
import RouterManagement from '../components/agent/RouterManagement';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
import { ticketsAPI, usersAPI, clientsAPI, routersAPI } from '../services/api';

function AgentDashboardContent() {
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [routers, setRouters] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [editingTicket, setEditingTicket] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, clientsResponse, routersResponse, techniciansResponse] = await Promise.all([
          ticketsAPI.getAll(),
          clientsAPI.getAll(),
          routersAPI.getAll(),
          usersAPI.getTechnicians()
        ]);
        setTickets(ticketsResponse.data.tickets || []);
        setClients(clientsResponse.data.clients || []);
        setRouters(routersResponse.data.routers || []);
        setTechnicians(techniciansResponse.data.technicians || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Failed to load data. Please try again.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
    setEditingTicket(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingTicket(null);
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      if (editingTicket) {
        await ticketsAPI.update(editingTicket.id, ticketData);
        showAlert('Ticket updated successfully!');
      } else {
        await ticketsAPI.create(ticketData);
        showAlert('Ticket created successfully!');
      }
      const response = await ticketsAPI.getAll();
      setTickets(response.data.tickets || []);
      setEditingTicket(null);
    } catch (error) {
      console.error('Error saving ticket:', error);
      showAlert('Failed to save ticket. Please try again.', 'danger');
    }
  };

  // TODO: Update TicketList and TicketForm components to handle API data structure and CRUD operations properly

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setShowCreateModal(true);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketsAPI.delete(ticketId);
        showAlert('Ticket deleted successfully!', 'info');
        const response = await ticketsAPI.getAll();
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error('Error deleting ticket:', error);
        showAlert('Failed to delete ticket. Please try again.', 'danger');
      }
    }
  };

  const handleOpenClientModal = () => {
    setShowClientModal(true);
    setEditingClient(null);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, clientData);
        showAlert('Client updated successfully!');
      } else {
        await clientsAPI.create(clientData);
        showAlert('Client created successfully!');
      }
      const response = await clientsAPI.getAll();
      setClients(response.data || []);
      setEditingClient(null);
      setShowClientModal(false);
    } catch (error) {
      console.error('Error saving client:', error);
      showAlert('Failed to save client. Please try again.', 'danger');
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.delete(clientId);
        showAlert('Client deleted successfully!', 'info');
        const response = await clientsAPI.getAll();
        setClients(response.data || []);
      } catch (error) {
        console.error('Error deleting client:', error);
        showAlert('Failed to delete client. Please try again.', 'danger');
      }
    }
  };

  return (
    <div className="bg-secondary p-4" >
      <div className="d-flex flex-column mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-4"> Agent Dashboard</h2>
          <div>
            <Button variant="primary" onClick={handleOpenCreateModal} className="me-2">
              Create Ticket
            </Button>
            <Button variant="success" onClick={handleOpenClientModal}>
              Add Client
            </Button>
          </div>
        </div>

        <div className="bg-primary p-4 card mb-4">
          <h3>Quick Summary</h3>
          <Row>
            <Col md={3}>
              <div className="text-center">
                <h4>{tickets.length}</h4>
                <small>Total Tickets</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h4>{tickets.filter(t => t.dateAssigned === new Date().toISOString().slice(0, 10)).length}</h4>
                <small>Today's Tickets</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h4>{clients.length}</h4>
                <small>Total Clients</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="text-center">
                <h4>{routers.length}</h4>
                <small>Total Routers</small>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <TicketForm 
        show={showCreateModal} 
        handleClose={handleCloseCreateModal}
        addTicket={handleCreateTicket}
        ticket={editingTicket}
        clients={clients}
      />

      <ClientForm 
        show={showClientModal} 
        handleClose={handleCloseClientModal}
        addClient={handleSaveClient}
        client={editingClient}
      />

      <Tabs defaultActiveKey="tickets" id="agent-tabs" className="mb-3 custom-tabs">
        <Tab 
          eventKey="tickets" 
          title={
            <span>
              <i className="bi bi-ticket-detailed me-1"></i> Tickets
            </span>
          }
        >
          <TicketList 
            tickets={tickets} 
            searchTerm={ticketSearchTerm} 
            onSearchChange={setTicketSearchTerm}
            onEdit={handleEditTicket}
            onDelete={handleDeleteTicket}
          />
        </Tab>
        <Tab 
          eventKey="clients" 
          title={
            <span>
              <i className="bi bi-people-fill me-1"></i> Clients
            </span>
          }
        >
          <ClientsTable 
            clients={clients} 
            handleEdit={handleEditClient}
            handleDelete={handleDeleteClient}
            searchTerm={clientSearchTerm}
            onSearchChange={setClientSearchTerm}
          />
        </Tab>
        <Tab 
          eventKey="routers" 
          title={
            <span>
              <i className="bi bi-router me-1"></i> Routers
            </span>
          }
        >
          <RouterManagement />
        </Tab>
      </Tabs>

      <CreateTicketModal
        show={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateTicket}
        ticket={editingTicket}
        technicians={technicians}
      />
    </div>
  );
}

function AgentDashboard() {
  return <AgentDashboardContent />;
}

export default AgentDashboard;

