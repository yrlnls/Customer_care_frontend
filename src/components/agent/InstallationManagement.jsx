import React, { useState } from 'react';
import { Card, Button, Table, Form, Badge, Row, Col, FormControl, Modal } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaTools } from 'react-icons/fa';

function InstallationManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState(null);
  const [installations, setInstallations] = useState([
    {
      id: 1,
      clientName: 'John Smith',
      address: '123 Main St, Nairobi',
      routerModel: 'TP-Link Archer C7',
      installationDate: '2025-01-15',
      status: 'Active',
      technician: 'Tech A',
      notes: 'Standard installation completed successfully'
    },
    {
      id: 2,
      clientName: 'Sarah Williams',
      address: '456 Park Ave, Mombasa',
      routerModel: 'Netgear Nighthawk R7000',
      installationDate: '2025-01-10',
      status: 'Pending',
      technician: 'Tech B',
      notes: 'Awaiting client confirmation for installation date'
    },
    {
      id: 3,
      clientName: 'Robert Davis',
      address: '789 Oak Rd, Kisumu',
      routerModel: 'Asus RT-AC86U',
      installationDate: '2025-01-08',
      status: 'Maintenance Required',
      technician: 'Tech C',
      notes: 'Router needs firmware update'
    }
  ]);

  const [formData, setFormData] = useState({
    clientName: '',
    address: '',
    routerModel: '',
    installationDate: '',
    status: 'Pending',
    technician: '',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingInstallation) {
      setInstallations(prev => prev.map(installation => 
        installation.id === editingInstallation.id 
          ? { ...formData, id: editingInstallation.id }
          : installation
      ));
    } else {
      setInstallations(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleEdit = (installation) => {
    setEditingInstallation(installation);
    setFormData(installation);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this installation record?')) {
      setInstallations(prev => prev.filter(installation => installation.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstallation(null);
    setFormData({
      clientName: '',
      address: '',
      routerModel: '',
      installationDate: '',
      status: 'Pending',
      technician: '',
      notes: ''
    });
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <Badge bg="success">Active</Badge>;
      case 'Pending': return <Badge bg="warning">Pending</Badge>;
      case 'Maintenance Required': return <Badge bg="danger">Maintenance Required</Badge>;
      case 'Inactive': return <Badge bg="secondary">Inactive</Badge>;
      default: return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  const filteredInstallations = installations.filter(installation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      installation.clientName.toLowerCase().includes(searchLower) ||
      installation.address.toLowerCase().includes(searchLower) ||
      installation.routerModel.toLowerCase().includes(searchLower) ||
      installation.technician.toLowerCase().includes(searchLower) ||
      installation.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card className="mt-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">Installation Management</Card.Title>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" />
            Add Installation
          </Button>
        </div>
        
        <div className="d-flex align-items-center mb-3">
          <div className="position-relative flex-grow-1">
            <FaSearch className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
            <FormControl
              type="search"
              placeholder="Search installations by client, address, router, technician, or status..."
              className="ps-5"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Address</th>
              <th>Router Model</th>
              <th>Installation Date</th>
              <th>Status</th>
              <th>Technician</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstallations.map(installation => (
              <tr key={installation.id}>
                <td>{installation.clientName}</td>
                <td>{installation.address}</td>
                <td>{installation.routerModel}</td>
                <td>{installation.installationDate}</td>
                <td>{getStatusBadge(installation.status)}</td>
                <td>{installation.technician}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(installation)}
                    className="me-2"
                    title="Edit Installation"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(installation.id)}
                    title="Delete Installation"
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredInstallations.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No installations found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <FaTools className="me-2" />
              {editingInstallation ? 'Edit Installation' : 'Add New Installation'}
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Client Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Router Model</Form.Label>
                    <Form.Control
                      type="text"
                      name="routerModel"
                      value={formData.routerModel}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Installation Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="installationDate"
                      value={formData.installationDate}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Active">Active</option>
                      <option value="Maintenance Required">Maintenance Required</option>
                      <option value="Inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Assigned Technician</Form.Label>
                <Form.Select
                  name="technician"
                  value={formData.technician}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Technician</option>
                  <option value="Tech A">Tech A</option>
                  <option value="Tech B">Tech B</option>
                  <option value="Tech C">Tech C</option>
                  <option value="Tech D">Tech D</option>
                  <option value="Tech E">Tech E</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Additional notes about the installation..."
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editingInstallation ? 'Update Installation' : 'Add Installation'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
}

export default InstallationManagement;
