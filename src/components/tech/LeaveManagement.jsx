import React, { useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

function LeaveManagement() {
  const [leaveDays, setLeaveDays] = useState([
    { id: 1, date: '2025-08-15', reason: 'Medical appointment', status: 'approved' },
    { id: 2, date: '2025-08-22', reason: 'Family event', status: 'pending' }
  ]);
  
  const [newLeave, setNewLeave] = useState({
    date: '',
    reason: '',
    status: 'pending'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLeave.date && newLeave.reason) {
      setLeaveDays(prev => [
        ...prev, 
        { ...newLeave, id: Date.now() }
      ]);
      setNewLeave({ date: '', reason: '', status: 'pending' });
    }
  };

  return (
    <div className="mt-4">
      <h4>Leave Management</h4>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="leave-date">Date</Form.Label>
          <Form.Control 
            id="leave-date"
            type="date" 
            name="date"
            value={newLeave.date}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label htmlFor="leave-reason">Reason</Form.Label>
          <Form.Control 
            id="leave-reason"
            as="textarea" 
            rows={2}
            name="reason"
            value={newLeave.reason}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        
        <Button variant="primary" type="submit">
          Request Leave
        </Button>
      </Form>
      
      <Table striped bordered className="mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leaveDays.map(leave => (
            <tr key={leave.id}>
              <td>{leave.date}</td>
              <td>{leave.reason}</td>
              <td>
                <span className={`badge bg-${
                  leave.status === 'approved' ? 'success' : 
                  leave.status === 'rejected' ? 'danger' : 'warning'
                }`}>
                  {leave.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default LeaveManagement;