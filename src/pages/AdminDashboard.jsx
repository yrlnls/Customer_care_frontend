import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import TicketAnalytics from '../components/admin/TicketAnalytics';
import ActivityLog from '../components/admin/ActivityLog';
import TicketList from '../components/admin/TicketList.jsx';
import CreateTicketModal from '../components/admin/CreateTicketModal.jsx';
import ClientsTable from '../components/agent/ClientsTable.jsx';
import ClientForm from '../components/agent/ClientForm.jsx';
import { ticketsAPI, usersAPI, clientsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

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

  // Fetch tickets and technicians on component mount
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
        // Update existing ticket
        await ticketsAPI.update(editingTicket.id, {
          title: ticketData.title,
          description: ticketData.description || '',
          priority: ticketData.priority || 'medium',
          status: ticketData.status || 'pending',
          assigned_tech_id: ticketData.assignedTechId
        });
        showAlert('Ticket updated successfully!');
      } else {
        // Create new ticket
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

      // Refresh tickets list
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

        // Refresh tickets list
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

  // Client management functions
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

        // Refresh clients list
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
        // Update existing client
        await clientsAPI.update(editingClient.id, clientData);
        showAlert('Client updated successfully!');
      } else {
        // Create new client
        await clientsAPI.create(clientData);
        showAlert('Client created successfully!');
      }

      // Refresh clients list
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

  // Get today's tickets
  const todaysTickets = tickets.filter(ticket =>
    ticket.dateAssigned === new Date().toISOString().slice(0, 10)
  );

  const completedTickets = tickets.filter(ticket => ticket.timeCompleted);
  const pendingTickets = tickets.filter(ticket => !ticket.timeCompleted);

  const handleNavigateToUsers = () => {
    navigate('/admin/manage-users');
  };

  const handleNavigateToReports = () => {
    navigate('/admin/view-reports');
  };

  const handleNavigateToSettings = () => {
    navigate('/admin/system-settings');
  };

  const handleNavigateToMetrics = () => {
    navigate('/admin/technician-metrics');
  };

  const handleNavigateToSites = () => {
    navigate('/admin/sites');
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Spinner animation="border" role="status" />
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {alert && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Tickets</Card.Title>
              <Card.Text className="display-4">{tickets.length}</Card.Text>
              <Button variant="outline-primary" size="sm">View All</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Today's Tickets</Card.Title>
              <Card.Text className="display-4">{todaysTickets.length}</Card.Text>
              <Button variant="outline-info" size="sm">View Today's</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Pending Tickets</Card.Title>
              <Card.Text className="display-4">{pendingTickets.length}</Card.Text>
              <Button variant="outline-warning" size="sm">View Pending</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Completed Today</Card.Title>
              <Card.Text className="display-4">{completedTickets.length}</Card.Text>
              <Button variant="outline-success" size="sm">View Completed</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Row */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Button 
                    variant="primary" 
                    className="w-100 mb-2"
                    onClick={handleNavigateToUsers}
                  >
                    <i className="bi bi-people me-2"></i>
                    Manage Users
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="success" 
                    className="w-100 mb-2"
                    onClick={handleNavigateToSites}
                  >
                    <i className="bi bi-geo-alt me-2"></i>
                    Sites Management
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="info" 
                    className="w-100 mb-2"
                    onClick={handleNavigateToReports}
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    View Reports
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="warning" 
                    className="w-100 mb-2"
                    onClick={handleNavigateToSettings}
                  >
                    <i className="bi bi-gear me-2"></i>
                    System Settings
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="secondary" 
                    className="w-100 mb-2"
                    onClick={handleNavigateToMetrics}
                  >
                    <i className="bi bi-graph-up me-2"></i>
                    Tech Metrics
                  </Button>
                </Col>
                <Col md={2}>
                  <Button 
                    variant="outline-primary" 
                    className="w-100 mb-2"
                    onClick={() => navigate('/map')}
                  >
                    <i className="bi bi-map me-2"></i>
                    View Map
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Ticket Management</h5>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Ticket
              </Button>
            </Card.Header>
            <Card.Body>
              <TicketList
                tickets={tickets}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onEdit={handleEditTicket}
                onDelete={handleDeleteTicket}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}>
          <Card className="mb-4">
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

      <Row className="mb-4">
        <Col md={8}>
          <TicketAnalytics />
        </Col>
        <Col md={4}>
          <ActivityLog />
        </Col>
      </Row>

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
