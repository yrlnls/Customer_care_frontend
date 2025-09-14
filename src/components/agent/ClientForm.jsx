import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';

function ClientForm({ show, handleClose, addClient, client }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Initialize form with client data when in edit mode
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      });
    } else {
      // Reset form when creating new client
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [client, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addClient(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{client ? 'Edit Client' : 'Add New Client'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {client ? 'Update Client' : 'Add Client'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ClientForm;