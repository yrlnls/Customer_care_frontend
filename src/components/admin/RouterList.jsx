import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Spinner, Alert, FormControl, Row, Col } from 'react-bootstrap';
import { FaSearch, FaWifi } from 'react-icons/fa';
import { MdSignalWifiOff } from 'react-icons/md';
import { routersAPI, clientsAPI } from '../../services/api';

function RouterList() {
  const [routers, setRouters] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [routersResponse, clientsResponse] = await Promise.all([
          routersAPI.getAll(),
          clientsAPI.getAll()
        ]);

        // Handle different response structures
        const routersData = routersResponse.data?.routers || routersResponse.data || [];
        const clientsData = clientsResponse.data?.clients || clientsResponse.data || [];

        setRouters(Array.isArray(routersData) ? routersData : []);
        setClients(Array.isArray(clientsData) ? clientsData : []);
      } catch (err) {
        console.error('Error fetching router data:', err);
        
        if (err.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view router data.');
        } else {
          setError(`Failed to load router data: ${err.response?.data?.message || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create a map of client_id to client name for quick lookup
  const clientMap = clients.reduce((map, client) => {
    map[client.id] = client.name || client.company_name || `Client ${client.id}`;
    return map;
  }, {});

  const filteredRouters = routers.filter(router => {
    const searchLower = searchTerm.toLowerCase();
    const clientName = clientMap[router.client_id] || 'Unknown Client';
    
    return (
      router.model?.toLowerCase().includes(searchLower) ||
      router.serial_number?.toLowerCase().includes(searchLower) ||
      router.location?.toLowerCase().includes(searchLower) ||
      router.status?.toLowerCase().includes(searchLower) ||
      clientName.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'online':
      case 'active':
        return (
          <Badge bg="success" className="d-flex align-items-center gap-1">
            <FaWifi size={12} />
            Online
          </Badge>
        );
      case 'offline':
        return (
          <Badge bg="danger" className="d-flex align-items-center gap-1">
            <MdSignalWifiOff size={12} />
            Offline
          </Badge>
        );
      case 'recovery needed':
        return <Badge bg="warning">Recovery Needed</Badge>;
      case 'recovery pending':
        return <Badge bg="info">Recovery Pending</Badge>;
      case 'maintenance':
        return <Badge bg="secondary">Maintenance</Badge>;
      default:
        return <Badge bg="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  const getOnlineCount = () => {
    return routers.filter(router => 
      router.status?.toLowerCase() === 'online' || 
      router.status?.toLowerCase() === 'active'
    ).length;
  };

  const getOfflineCount = () => {
    return routers.filter(router => 
      router.status?.toLowerCase() === 'offline'
    ).length;
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <Spinner animation="border" role="status" />
          <div className="mt-2">Loading routers...</div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">{error}</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Router Management</h5>
          <div className="d-flex gap-3">
            <Badge bg="success" className="px-3 py-2">
              <FaWifi className="me-1" />
              Online: {getOnlineCount()}
            </Badge>
            <Badge bg="danger" className="px-3 py-2">
              <MdSignalWifiOff className="me-1" />
              Offline: {getOfflineCount()}
            </Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {/* Search Bar */}
        <Row className="mb-3">
          <Col md={6}>
            <div className="position-relative">
              <FaSearch 
                className="position-absolute" 
                style={{ 
                  left: '10px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#6c757d' 
                }} 
              />
              <FormControl
                type="search"
                placeholder="Search by router model, serial, client, location, or status..."
                className="ps-5"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </Col>
        </Row>

        {/* Router Table */}
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Router Model</th>
              <th>Serial Number</th>
              <th>Assigned Client</th>
              <th>Status</th>
              <th>Location</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {filteredRouters.map(router => (
              <tr key={router.id}>
                <td>
                  <strong>{router.model || 'N/A'}</strong>
                </td>
                <td>
                  <code>{router.serial_number || 'N/A'}</code>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person-circle me-2 text-primary"></i>
                    {clientMap[router.client_id] || 'Unassigned'}
                  </div>
                </td>
                <td>
                  {getStatusBadge(router.status)}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt me-2 text-muted"></i>
                    {router.location || 'Not specified'}
                  </div>
                </td>
                <td>
                  {router.last_seen ? (
                    <small className="text-muted">
                      {new Date(router.last_seen).toLocaleString()}
                    </small>
                  ) : (
                    <small className="text-muted">Never</small>
                  )}
                </td>
              </tr>
            ))}
            {filteredRouters.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  {searchTerm ? 
                    'No routers found matching your search criteria' : 
                    'No routers available'
                  }
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Summary Stats */}
        {routers.length > 0 && (
          <div className="mt-3 p-3 bg-light rounded">
            <Row>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 mb-0">{routers.length}</div>
                  <small className="text-muted">Total Routers</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 mb-0 text-success">{getOnlineCount()}</div>
                  <small className="text-muted">Online</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 mb-0 text-danger">{getOfflineCount()}</div>
                  <small className="text-muted">Offline</small>
                </div>
              </Col>
              <Col md={3}>
                <div className="text-center">
                  <div className="h4 mb-0 text-info">
                    {clients.length}
                  </div>
                  <small className="text-muted">Active Clients</small>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default RouterList;
