import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import UserForm from '../components/admin/UserForm';

const ManageUsersPage = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await usersAPI.getAll();
        setUsers(response.data.users || []);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserForm(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await usersAPI.delete(userToDelete.id);
        // Refresh users list
        const response = await usersAPI.getAll();
        setUsers(response.data.users || []);
        setShowDeleteModal(false);
        setUserToDelete(null);
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user');
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleSubmitUser = async (userData) => {
    try {
      console.log('Submitting user data:', userData); // Debug log
      if (editingUser) {
        // Update existing user
        await usersAPI.update(editingUser.id, userData);
      } else {
        // Create new user
        await usersAPI.create(userData);
      }
      // Refresh users list
      const response = await usersAPI.getAll();
      setUsers(response.data.users || []);
      setShowUserForm(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error saving user:', err);
      console.error('Error response:', err.response?.data); // Debug log
      setError('Failed to save user');
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="container-main p-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>This page is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-main p-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-main p-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main p-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Users</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleAddUser}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New User
        </button>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-muted">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted"></i>
              <p className="text-muted mt-3">
                {searchTerm ? 'No users found matching your search.' : 'No users available.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'agent' ? 'warning' : 'info'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${user.status === 'active' ? 'success' : 'secondary'}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditUser(user)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(user)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete the user <strong>{userToDelete?.name}</strong>?</p>
                <p className="text-muted">This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUserForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleSubmitUser}
          onClose={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

export default ManageUsersPage;
