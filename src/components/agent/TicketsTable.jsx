import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';

function TicketsTable({ tickets, handleEdit, handleDelete }) {
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'low': return <Badge bg="success" className="rounded-pill">Low</Badge>;
      case 'medium': return <Badge bg="warning" className="rounded-pill">Medium</Badge>;
      case 'high': return <Badge bg="danger" className="rounded-pill">High</Badge>;
      case 'critical': return <Badge bg="dark" className="rounded-pill">Critical</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill">N/A</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <Badge bg="warning" className="rounded-pill">Pending</Badge>;
      case 'in-progress': return <Badge bg="info" className="rounded-pill">In Progress</Badge>;
      case 'completed': return <Badge bg="success" className="rounded-pill">Completed</Badge>;
      default: return <Badge bg="secondary" className="rounded-pill">N/A</Badge>;
    }
  };

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="mt-4 rounded-3 overflow-hidden">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Client</th>
            <th>Priority</th>
            <th>Assigned Tech</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket, index) => (
            <tr key={ticket.id} className={index % 2 === 0 ? '' : 'table-light'}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.clientName}</td>
              <td>{getPriorityBadge(ticket.priority)}</td>
              <td>{ticket.assignedTech}</td>
              <td>{getStatusBadge(ticket.status)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleEdit(ticket)}
                  className="me-2"
                  title="Edit"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(ticket.id)}
                  title="Delete"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TicketsTable;