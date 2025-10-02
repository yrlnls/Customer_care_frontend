import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSites } from '../context/SitesContext';
import AddSiteModal from '../components/sites/AddSiteModal';

const SitesManagementPage = () => {
  const { userRole } = useAuth();
  const {
    sites,
    loading,
    error,
    loadSites,
    addSite,
    updateSite,
    deleteSite,
  } = useSites();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleAddSite = async (siteData) => {
    try {
      await addSite(siteData);
      setShowAddForm(false);
    } catch {
      // error already handled in context
    }
  };

  const handleUpdateSite = async (siteData) => {
    try {
      await updateSite(editingSite.id, siteData);
      setShowEditForm(false);
      setEditingSite(null);
    } catch {
      // error already handled in context
    }
  };

  const handleDeleteSite = async (siteId) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await deleteSite(siteId);
      } catch {
        // error already handled in context
      }
    }
  };

  // Ensure sites is always an array before filtering
  const sitesArray = Array.isArray(sites) ? sites : [];

  const filteredSites = sitesArray.filter((site) => {
    const matchesSearch =
      site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || site.type === filterType;
    return matchesSearch && matchesType;
  });

  const siteTypes = [
    { value: 'office', label: 'Office' },
    { value: 'branch', label: 'Branch' },
    { value: 'datacenter', label: 'Data Center' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'remote', label: 'Remote Site' },
  ];

  const statusColors = {
    active: 'success',
    maintenance: 'warning',
    inactive: 'secondary',
  };

  if (userRole !== 'admin' && userRole !== 'tech') {
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
      <div className="container-main p-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading sites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-main p-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadSites}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-lg-5 py-3 py-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 className="h3 mb-0">
          <i className="bi bi-geo-alt me-2"></i>
          Sites Management
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          <span className="d-none d-sm-inline">Add New Site</span>
          <span className="d-inline d-sm-none">Add Site</span>
        </button>
      </div>

      {/* Search + Filter */}
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
                  placeholder="Search sites..."
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                {siteTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <div className="text-muted">
                {filteredSites.length} sites
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sites Table */}
      <div className="card">
        <div className="card-body">
          {filteredSites.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-geo-alt fs-1 text-muted"></i>
              <p className="text-muted mt-3">
                {searchTerm
                  ? 'No sites found matching your search.'
                  : 'No sites available.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="table-responsive d-none d-lg-block">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Address</th>
                      <th>Coordinates</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSites.map((site) => (
                      <tr key={site.id}>
                        <td>
                          <strong>{site.name}</strong>
                          <br />
                          <small className="text-muted">
                            {site.description || 'No description'}
                          </small>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              site.type === 'datacenter'
                                ? 'danger'
                                : site.type === 'office'
                                ? 'primary'
                                : 'info'
                            }`}
                          >
                            {siteTypes.find((t) => t.value === site.type)?.label ||
                              site.type}
                          </span>
                        </td>
                        <td>{site.address || 'No address'}</td>
                        <td>
                          <small>
                            Lat: {site.latitude || site.lat}
                            <br />
                            Lng: {site.longitude || site.lng}
                          </small>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              statusColors[site.status] || 'secondary'
                            }`}
                          >
                            {site.status || 'unknown'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setEditingSite(site);
                                setShowEditForm(true);
                              }}
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteSite(site.id)}
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

              {/* Mobile Card Layout */}
              <div className="d-lg-none">
                <div className="row">
                  {filteredSites.map((site) => (
                    <div key={site.id} className="col-12 mb-3">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0 fw-bold">
                              {site.name}
                            </h6>
                            <div className="d-flex gap-2">
                              <span
                                className={`badge bg-${
                                  statusColors[site.status] || 'secondary'
                                }`}
                              >
                                {site.status || 'unknown'}
                              </span>
                              <span
                                className={`badge bg-${
                                  site.type === 'datacenter'
                                    ? 'danger'
                                    : site.type === 'office'
                                    ? 'primary'
                                    : 'info'
                                }`}
                              >
                                {siteTypes.find((t) => t.value === site.type)?.label ||
                                  site.type}
                              </span>
                            </div>
                          </div>
                          
                          {site.description && (
                            <p className="text-muted mb-2 small">
                              {site.description}
                            </p>
                          )}
                          
                          {site.address && (
                            <div className="mb-2">
                              <small className="text-muted">Address:</small>
                              <span className="ms-2">{site.address}</span>
                            </div>
                          )}
                          
                          <div className="mb-2">
                            <small className="text-muted">Coordinates:</small>
                            <small className="ms-2">
                              Lat: {site.latitude || site.lat}, 
                              Lng: {site.longitude || site.lng}
                            </small>
                          </div>
                          
                          <div className="d-flex gap-2 mt-3">
                            <button
                              className="btn btn-sm btn-outline-primary flex-fill"
                              onClick={() => {
                                setEditingSite(site);
                                setShowEditForm(true);
                              }}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger flex-fill"
                              onClick={() => handleDeleteSite(site.id)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AddSiteModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddSite}
      />

      <AddSiteModal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setEditingSite(null);
        }}
        onSubmit={handleUpdateSite}
        initialData={editingSite}
        isEditMode={true}
      />
    </div>
  );
};

export default SitesManagementPage;
