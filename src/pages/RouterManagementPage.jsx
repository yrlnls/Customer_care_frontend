import React from 'react';
import { Container } from 'react-bootstrap';
import RouterList from '../components/admin/RouterList';

function RouterManagementPage() {
  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Router Management</h2>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/admin/dashboard">Admin</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Router Management
            </li>
          </ol>
        </nav>
      </div>
      
      <RouterList />
    </Container>
  );
}

export default RouterManagementPage;
