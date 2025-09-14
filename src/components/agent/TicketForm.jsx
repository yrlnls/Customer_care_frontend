import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

function TicketForm({ show, handleClose, addTicket, ticket, clients = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    priority: 'medium',
    status: 'pending'
  });

  // Initialize form with ticket data when in edit mode
  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description || '',
        client_id: ticket.client_id,
        priority: ticket.priority,
        status: ticket.status
      });
    } else {
      // Reset form when creating new ticket
      setFormData({
        title: '',
        description: '',
        client_id: '',
        priority: 'medium',
        status: 'pending'
      });
    }
  }, [ticket, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTicket(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ticket ? 'Edit Ticket' : 'Create New Ticket'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Form.Select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select 
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select 
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {ticket ? 'Update Ticket' : 'Create Ticket'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default TicketForm;