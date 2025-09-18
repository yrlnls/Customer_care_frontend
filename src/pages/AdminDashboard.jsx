import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner, Tabs, Tab, Form } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';
import ActivityLog from '../components/admin/ActivityLog';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
import ClientsTable from '../components/agent/ClientsTable.jsx';
import ClientForm from '../components/agent/ClientForm.jsx';
import { ticketsAPI, usersAPI, clientsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [alert, setAlert] = useState(null);
  const [activeTab, setActiveTab] = useState('today');

  // New: state for date filtering
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  // Fetch tickets, technicians, and clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsResponse, techniciansResponse, clientsResponse] = await Promise.all([
          ticketsAPI.getAll(),
          usersAPI.getTechnicians(),
          clientsAPI.getAll()
        ]);

        setTickets(ticketsResponse.data.tickets || []);
        setTechnicians(techniciansResponse.data.technicians || []);
        setClients(clientsResponse.data.clients || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        showAlert('Failed to load data. Please try again.', 'danger');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCreateTicket = async (ticketData) => {
    try {
      if (editingTicket) {
        await ticketsAPI.update(editingTicket.id, {
          title: ticketData.title,
          description: ticketData.description || '',
          priority: ticketData.priority || 'medium',
          status: ticketData.status || 'pending',
          assigned_tech_id: ticketData.assignedTechId
        });
        showAlert('Ticket updated successfully!');
      } else {
        await ticketsAPI.create({
          title: ticketData.title,
          description: ticketData.description || '',
          priority: ticketData.priority || 'medium',
          status: ticketData.status || 'pending',
          client_id: ticketData.client_id || ticketData.clientId,
          assigned_tech_id: ticketData.assigned_tech_id || ticketData.assignedTechId
        });
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

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingTicket(null);
  };

  // Client management
  const handleAddClient = () => {
    setEditingClient(null);
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowClientModal(true);
  };

  const handleDeleteClient = async (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await clientsAPI.delete(clientId);
        showAlert('Client deleted successfully!', 'info');

        const response = await clientsAPI.getAll();
        setClients(response.data.clients || []);
      } catch (error) {
        console.error('Error deleting client:', error);
        showAlert('Failed to delete client. Please try again.', 'danger');
      }
    }
  };

  const handleSubmitClient = async (clientData) => {
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, clientData);
        showAlert('Client updated successfully!');
      } else {
        await clientsAPI.create(clientData);
        showAlert('Client created successfully!');
      }

      const response = await clientsAPI.getAll();
      setClients(response.data.clients || []);
      setEditingClient(null);
    } catch (error) {
      console.error('Error saving client:', error);
      showAlert('Failed to save client. Please try again.', 'danger');
    }
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
    setEditingClient(null);
  };

  // Ticket filters
  const todaysTickets = tickets.filter(ticket =>
    ticket.dateAssigned === new Date().toISOString().slice(0, 10)
  );

  const dateFilteredTickets = tickets.filter(
    (ticket) => ticket.dateAssigned === selectedDate
  );

  const completedTickets = tickets.filter(ticket => ticket.timeCompleted);
  const pendingTickets = tickets.filter(ticket => !ticket.timeCompleted);

  const handleNavigateToUsers = () => navigate('/admin/manage-users');
  const handleNavigateToReports = () => navigate('/admin/view-reports');
  const handleNavigateToSettings = () => navigate('/admin/system-settings');
  const handleNavigateToMetrics = () => navigate('/admin/technician-metrics');
  const handleNavigateToSites = () => navigate('/admin/sites');

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-header">Admin Dashboard</h2>

      {alert && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4 stats-cards">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-ticket-detailed display-4 text-primary mb-2"></i>
              <Card.Title>Total Tickets</Card.Title>
              <Card.Text className="display-4">{tickets.length}</Card.Text>
              <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('all')}>
                View All
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-calendar-event display-4 text-info mb-2"></i>
              <Card.Title>Today's Tickets</Card.Title>
              <Card.Text className="display-4">{todaysTickets.length}</Card.Text>
              <Button variant="outline-info" size="sm" onClick={() => setActiveTab('today')}>
                View Today's
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-clock display-4 text-warning mb-2"></i>
              <Card.Title>Pending Tickets</Card.Title>
              <Card.Text className="display-4">{pendingTickets.length}</Card.Text>
              <Button variant="outline-warning" size="sm" onClick={() => setActiveTab('pending')}>
                View Pending
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <i className="bi bi-check-circle display-4 text-success mb-2"></i>
              <Card.Title>Completed</Card.Title>
              <Card.Text className="display-4">{completedTickets.length}</Card.Text>
              <Button variant="outline-success" size="sm" onClick={() => setActiveTab('completed')}>
                View Completed
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Ticket Views */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="management-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Ticket Management</h5>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Ticket
              </Button>
            </Card.Header>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="all" title="All Tickets">
                  <TicketList
                    tickets={tickets}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                </Tab>
                <Tab eventKey="today" title="Tickets by Date">
                  <Form.Group className="mb-3" controlId="filterDate">
                    <Form.Label>Select Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </Form.Group>
                  <TicketList
                    tickets={dateFilteredTickets}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                </Tab>
                <Tab eventKey="pending" title="Pending Tickets">
                  <TicketList
                    tickets={pendingTickets}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                </Tab>
                <Tab eventKey="completed" title="Completed Tickets">
                  <TicketList
                    tickets={completedTickets}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onEdit={handleEditTicket}
                    onDelete={handleDeleteTicket}
                  />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Client Management */}
      <Row className="mb-4">
        <Col md={12}>
          <Card className="management-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Client Management</h5>
              <Button variant="success" onClick={handleAddClient}>
                Add New Client
              </Button>
            </Card.Header>
            <Card.Body>
              <ClientsTable
                clients={clients}
                serachTerm={clientSearchTerm}
                onSearchChange={setClientSearchTerm}
                handleEdit={handleEditClient}
                handleDelete={handleDeleteClient}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analytics & Logs */}
      <Row className="mb-4 analytics-section">
        <Col md={8}>
          <TicketAnalytics />
        </Col>
        <Col md={4}>
          <ActivityLog />
        </Col>
      </Row>

      {/* Modals */}
      <CreateTicketModal
        show={showCreateModal}
        onClose={handleCloseModal}
        onCreate={handleCreateTicket}
        ticket={editingTicket}
        technicians={technicians}
        clients={clients}
      />

      <ClientForm
        show={showClientModal}
        handleClose={handleCloseClientModal}
        addClient={handleSubmitClient}
        client={editingClient}
      />
    </div>
  );
}

export default AdminDashboard;
