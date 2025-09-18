import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateTicketModal({ show, onClose, onCreate, technicians, ticket, clients = [] }) {
  const [title, setTitle] = useState('');
  const [assignedBy, setAssignedBy] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [clientId, setClientId] = useState('');
  const [dateAssigned, setDateAssigned] = useState(new Date().toISOString().slice(0, 10));
  const [timeAssigned, setTimeAssigned] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [timeCompleted, setTimeCompleted] = useState('');

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title || '');
      setAssignedBy(ticket.assignedBy || '');
      setAssignedTo(ticket.assignedTo || '');
      setClientId(ticket.client_id || ticket.clientId || '');
      setDateAssigned(ticket.dateAssigned || new Date().toISOString().slice(0, 10));
      setTimeAssigned(ticket.timeAssigned || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeCompleted(ticket.timeCompleted || '');
    } else {
      setTitle('');
      setAssignedBy('');
      setAssignedTo('');
      setClientId('');
      setDateAssigned(new Date().toISOString().slice(0, 10));
      setTimeAssigned(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeCompleted('');
    }
  }, [ticket, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Find the selected technician's ID
    const selectedTechnician = technicians.find(tech => tech.name === assignedTo);

    const ticketData = {
      id: ticket ? ticket.id : Date.now(),
      title,
      assignedBy,
      assignedTo,
      assigned_tech_id: selectedTechnician ? selectedTechnician.id : null,
      client_id: clientId,
      dateAssigned,
      timeAssigned,
      timeCompleted: timeCompleted || null,
    };
    onCreate(ticketData);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{ticket ? 'Edit Ticket' : 'Create Ticket'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAssignedBy">
            <Form.Label>Assigned By</Form.Label>
            <Form.Control
              type="text"
              value={assignedBy}
              onChange={e => setAssignedBy(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAssignedTo">
            <Form.Label>Assigned To</Form.Label>
            <Form.Select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select Technician</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.name}>{tech.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formClient">
            <Form.Label>Client</Form.Label>
            <Form.Select
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              required
            >
              <option value="">Select Client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </Form.Select> 
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDateAssigned">
            <Form.Label>Date Assigned</Form.Label>
            <Form.Control
              type="date"
              value={dateAssigned}
              onChange={e => setDateAssigned(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTimeAssigned">
            <Form.Label>Time Assigned</Form.Label>
            <Form.Control
              type="time"
              value={timeAssigned}
              onChange={e => setTimeAssigned(e.target.value)}
              required
            />
          </Form.Group>
          {ticket && (
            <Form.Group className="mb-3" controlId="formTimeCompleted">
              <Form.Label>Time Completed (Optional)</Form.Label>
              <Form.Control
                type="time"
                value={timeCompleted}
                onChange={e => setTimeCompleted(e.target.value)}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">
            {ticket ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateTicketModal;
