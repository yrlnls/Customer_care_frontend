import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sitesAPI } from '../services/api';
import AddSiteModal from '../components/sites/AddSiteModal';

const SitesManagementPage = () => {
  const { userRole } = useAuth();
  const [sites, setSites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sitesAPI.getAll();
      setSites(response.data || []);
    } catch (error) {
      console.error('Error loading sites:', error);
      setError('Failed to load sites');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSite = async (siteData) => {
    try {
      const response = await sitesAPI.create(siteData);
      setSites(prev => [...prev, response.data]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding site:', error);
      setError('Failed to add site');
    }
  };

  const handleUpdateSite = async (siteData) => {
    try {
      const response = await sitesAPI.update(editingSite.id, siteData);
      setSites(prev => prev.map(site => site.id === editingSite.id ? updatedSite : site));
      setShowEditForm(false);
      setEditingSite(null);
    } catch (error) {
      console.error('Error updating site:', error);
      setError('Failed to update site');
    }
  };

  const handleDeleteSite = async (siteId) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await sitesAPI.delete(siteId);
        setSites(prev => prev.filter(site => site.id !== siteId));
      } catch (error) {
        console.error('Error deleting site:', error);
        setError('Failed to delete site');
      }
    }
  };

  const openEditForm = (site) => {
    setEditingSite(site);
    setShowEditForm(true);
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    { value: 'remote', label: 'Remote Site' }
  ];

  const statusColors = {
    active: 'success',
    maintenance: 'warning',
    inactive: 'secondary'
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
      <div className="container-main p-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading sites...</p>
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
          <button className="btn btn-primary" onClick={loadSites}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main p-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Sites Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Site
        </button>
      </div>

      {/* Search and Filter */}
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

      {/* Sites List */}
      <div className="card">
        <div className="card-body">
          {filteredSites.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-geo-alt fs-1 text-muted"></i>
              <p className="text-muted mt-3">
                {searchTerm ? 'No sites found matching your search.' : 'No sites available.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
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
                        <small className="text-muted">{site.description || 'No description'}</small>
                      </td>
                      <td>
                        <span className={`badge bg-${site.type === 'datacenter' ? 'danger' : site.type === 'office' ? 'primary' : 'info'}`}>
                          {siteTypes.find(t => t.value === site.type)?.label || site.type}
                        </span>
                      </td>
                      <td>{site.address || 'No address'}</td>
                      <td>
                        <small>
                          Lat: {site.latitude || site.lat}<br />
                          Lng: {site.longitude || site.lng}
                        </small>
                      </td>
                      <td>
                        <span className={`badge bg-${statusColors[site.status] || 'secondary'}`}>
                          {site.status || 'unknown'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditForm(site)}
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
          )}
        </div>
      </div>

      <AddSiteModal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
        }}
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
