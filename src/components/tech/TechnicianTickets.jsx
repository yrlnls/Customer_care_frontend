import React, { useState } from 'react';
import { Card, Button, Badge, Form, Modal } from 'react-bootstrap';
import { ticketsAPI } from '../../services/api';

function TechnicianTickets({ tickets, updateTicket, refreshTickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  
  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setComment('');
    setTimeSpent('');
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
    setComment('');
    setTimeSpent('');
  };
  
  const handleStatusChange = (status) => {
    if (selectedTicket) {
      updateTicket(selectedTicket.id, { status });
      setSelectedTicket({ ...selectedTicket, status });
    }
  };
  
  const handleAddComment = async () => {
    if (selectedTicket && comment.trim()) {
      try {
        await ticketsAPI.addComment(selectedTicket.id, comment);
        setComment('');
        // Refresh tickets after adding comment
        if (typeof refreshTickets === 'function') {
          refreshTickets();
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };
  
  const handleRecordTime = () => {
    if (selectedTicket && timeSpent) {
      const minutes = parseInt(timeSpent, 10);
      if (!isNaN(minutes) && minutes > 0) {
        updateTicket(selectedTicket.id, { 
          timeSpent: (selectedTicket.timeSpent || 0) + minutes
        });
        setTimeSpent('');
      }
    }
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <Badge bg="secondary">Pending</Badge>;
      case 'in-progress': return <Badge bg="info">In Progress</Badge>;
      case 'completed': return <Badge bg="success">Completed</Badge>;
      default: return <Badge bg="secondary">N/A</Badge>;
    }
  };
  
  return (
    <div>
      <h3 className="mb-3">Assigned Tickets</h3>
      
      <div className="d-flex flex-wrap gap-3 mb-4">
        {tickets.map(ticket => (
          <Card 
            key={ticket.id} 
            style={{ width: '18rem' }}
            className="mb-3"
          >
            <Card.Body>
              <Card.Title>{ticket.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {ticket.clientName}
              </Card.Subtitle>
              <div className="d-flex justify-content-between mb-2">
                <span>{getStatusBadge(ticket.status)}</span>
                <span>Time: {ticket.timeSpent || 0} min</span>
              </div>
              <Button 
                size="sm" 
                variant="outline-primary" 
                className="w-100"
                onClick={() => handleSelectTicket(ticket)}
              >
                View Details
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
      
      {selectedTicket && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Ticket Details: {selectedTicket.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Client:</strong> {selectedTicket.clientName}</p>
            <p><strong>Description:</strong> {selectedTicket.description}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Priority:</strong> {selectedTicket.priority}</p>
            <p><strong>Time Spent:</strong> {selectedTicket.timeSpent || 0} minutes</p>
            
            <div className="mb-3">
              <h5>Update Status</h5>
              <div className="d-flex gap-2">
                <Button 
                  size="sm"
                  variant={selectedTicket.status === 'pending' ? 'primary' : 'outline-primary'}
                  onClick={() => handleStatusChange('pending')}
                >
                  Pending
                </Button>
                <Button 
                  size="sm"
                  variant={selectedTicket.status === 'in-progress' ? 'primary' : 'outline-info'}
                  onClick={() => handleStatusChange('in-progress')}
                >
                  In Progress
                </Button>
                <Button 
                  size="sm"
                  variant={selectedTicket.status === 'completed' ? 'primary' : 'outline-success'}
                  onClick={() => handleStatusChange('completed')}
                >
                  Completed
                </Button>
              </div>
            </div>
            
            <div className="mb-3">
              <h5>Add Comment</h5>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                />
              </Form.Group>
              <Button 
                size="sm"
                variant="primary" 
                className="mt-2"
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                Add Comment
              </Button>
            </div>
            
            <div className="mb-3">
              <h5>Record Time Spent</h5>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Minutes"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(e.target.value)}
                  style={{ width: '100px' }}
                />
                <Button 
                  size="sm"
                  variant="warning"
                  onClick={handleRecordTime}
                  disabled={!timeSpent}
                >
                  Record Time
                </Button>
              </div>
            </div>
            
            <div>
              <h5>Comments</h5>
              {selectedTicket.comments?.length > 0 ? (
                <div className="list-group">
                  {selectedTicket.comments.map(comment => (
                    <div key={comment.id} className="list-group-item">
                      <p className="mb-1">{comment.text}</p>
                      <small className="text-muted">
                        {new Date(comment.timestamp).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default TechnicianTickets;