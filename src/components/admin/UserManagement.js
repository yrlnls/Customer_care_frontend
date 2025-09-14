import React from 'react';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import { useData } from '../../context/DataContext';

function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useData();

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="d-flex justify-content-between mb-4">
        <h4>User Management</h4>
        <Button variant="primary">Add New User</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td><Badge bg="info">{user.role}</Badge></td>
              <td><Badge bg={user.active ? 'success' : 'secondary'}>
                {user.active ? 'Active' : 'Inactive'}
              </Badge></td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2">
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UserManagement;
