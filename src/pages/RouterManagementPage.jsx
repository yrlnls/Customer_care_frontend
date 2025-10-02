import React from 'react';
import { Container } from 'react-bootstrap';
import RouterList from '../components/admin/RouterList';

function RouterManagementPage() {
  return (
    <Container fluid className="px-3 px-lg-4 py-3 py-lg-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="h3 mb-0">
          <i className="bi bi-router me-2"></i>
          Router Management
        </h2>
        <nav aria-label="breadcrumb" className="d-none d-md-block">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/admin/dashboard" className="text-decoration-none">
                <i className="bi bi-house me-1"></i>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Router Management
            </li>
          </ol>
        </nav>
        
        {/* Mobile breadcrumb */}
        <div className="d-md-none">
          <a href="/admin/dashboard" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1"></i>
            Back to Dashboard
          </a>
        </div>
      </div>
      
      <RouterList />
    </Container>
  );
}

export default RouterManagementPage;
