import React, { useState } from 'react';
import { Table, FormControl, Badge, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';

function TicketList({ tickets, searchTerm, onSearchChange, onEdit, onDelete }) {
  const [dateFilter, setDateFilter] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      ticket.title.toLowerCase().includes(searchLower) ||
      (ticket.created_by_name || '').toLowerCase().includes(searchLower) ||
      (ticket.assigned_tech_name || '').toLowerCase().includes(searchLower) ||
      (ticket.created_at || '').toLowerCase().includes(searchLower)
    );

    const matchesDate = !dateFilter || (ticket.created_at && new Date(ticket.created_at).toISOString().slice(0, 10) === dateFilter);

    return matchesSearch && matchesDate;
  });

  const getStatusBadge = (status, completedAt) => {
    if (status === 'completed' || completedAt) {
      return <Badge bg="success">Completed</Badge>;
    } else if (status === 'in-progress') {
      return <Badge bg="primary">In Progress</Badge>;
    } else {
      return <Badge bg="warning">Pending</Badge>;
    }
  };

  return (
    <>
      <div className="d-flex align-items-center mb-3 gap-3">
        <div className="position-relative flex-grow-1">
          <FaSearch className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }} />
          <FormControl
            type="search"
            placeholder="Search tickets by title, created by, assigned to, or date..."
            className="ps-5"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
        <div className="d-flex align-items-center">
          <FaFilter className="me-2" />
          <Form.Control
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            placeholder="Filter by creation date"
            style={{ width: '200px' }}
          />
          {dateFilter && (
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-2"
              onClick={() => setDateFilter('')}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Created By</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Completed At</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>
                <Badge bg={
                  ticket.priority === 'critical' ? 'danger' :
                  ticket.priority === 'high' ? 'warning' :
                  ticket.priority === 'medium' ? 'info' : 'secondary'
                }>
                  {ticket.priority}
                </Badge>
              </td>
              <td>{ticket.created_by_name || 'Unknown'}</td>
              <td>{ticket.assigned_tech_name || 'Unassigned'}</td>
              <td>{getStatusBadge(ticket.status, ticket.completed_at)}</td>
              <td>{ticket.completed_at ? new Date(ticket.completed_at).toLocaleDateString() : '-'}</td>
              <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : '-'}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => onEdit && onEdit(ticket)}
                  className="me-2"
                  title="Edit Ticket"
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete && onDelete(ticket.id)}
                  title="Delete Ticket"
                >
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
          {filteredTickets.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No tickets found matching your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

export default TicketList;
