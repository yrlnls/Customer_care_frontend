import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const AddSiteModal = ({ isOpen, onClose, onSubmit, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    description: '',
    type: 'office',
    status: 'active',
    address: '',
    contact: ''
  });

  const siteTypes = [
    { value: 'office', label: 'Office' },
    { value: 'branch', label: 'Branch' },
    { value: 'datacenter', label: 'Data Center' },
    { value: 'warehouse', label: 'Warehouse' },
    { value: 'remote', label: 'Remote Site' }
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        lat: initialData.latitude || initialData.lat || '',
        lng: initialData.longitude || initialData.lng || '',
        description: initialData.description || '',
        type: initialData.type || 'office',
        status: initialData.status || 'active',
        address: initialData.address || '',
        contact: initialData.contact || ''
      });
    } else {
      setFormData({
        name: '',
        lat: '',
        lng: '',
        description: '',
        type: 'office',
        status: 'active',
        address: '',
        contact: ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditMode ? 'Edit Site' : 'Add New Site'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Site Name *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Site Type *</label>
                    <select 
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                    >
                      {siteTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Latitude *</label>
                    <input 
                      type="number" 
                      step="0.000001"
                      className="form-control" 
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Longitude *</label>
                    <input 
                      type="number" 
                      step="0.000001"
                      className="form-control" 
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Contact</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select 
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              {isEditMode ? 'Update Site' : 'Add Site'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AddSiteModal;
