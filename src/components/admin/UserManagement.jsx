import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Table, Button, Badge, Form } from 'react-bootstrap';
import UserForm from './UserForm';
import { useData } from '../../context/DataContext';

function UserManagement() {
  const { users, addUser, updateUser, deleteUser } = useData();
  const [showModal, setShowModal] = useState(false);
  const [currentEditingUser, setCurrentEditingUser] = useState(null);

  const handleAdd = () => {
    setCurrentEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setCurrentEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <div className="d-flex justify-content-between mb-4">
        <h4>User Management</h4>
        <Button variant="primary" onClick={handleAdd}>
          Add New User
        </Button>
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
<td><Badge bg={user.status === 'Active' ? 'success' : 'secondary'}>
{user.status}
</Badge></td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
<UserForm
  initialData={currentEditingUser}
  onCancel={() => {
    setShowModal(false);
    setCurrentEditingUser(null);
  }}
  onSubmit={(formData) => {
    if (formData.id) {
      updateUser(formData.id, formData);
    } else {
      addUser(formData);
    }
    setShowModal(false);
    // Add success toast notification here if needed
  }}
/>
      )}
    </div>
  );
}

export default UserManagement;
