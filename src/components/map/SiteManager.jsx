import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import AddSiteModal from '../sites/AddSiteModal';

const SiteManager = ({ map, onSiteAdded, layerGroup }) => {
  const { userRole } = useAuth();
  const [sites, setSites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [newSite, setNewSite] = useState({
    name: '',
    lat: '',
    lng: '',
    description: '',
    type: 'office',
    status: 'active',
    address: '',
    contact: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!map) return;

    // Load existing sites
    loadSites();
  }, [map]);

  // Expose edit and delete functions to global scope for popup buttons
  useEffect(() => {
    window.editSite = (siteId) => {
      // Ensure sites is always an array before searching
      const sitesArray = Array.isArray(sites) ? sites : [];
      const site = sitesArray.find(s => s._id === siteId);
      if (site) {
        handleEditClick(site);
      }
    };

    window.deleteSite = (siteId) => {
      // Ensure sites is always an array before searching
      const sitesArray = Array.isArray(sites) ? sites : [];
      const site = sitesArray.find(s => s._id === siteId);
      if (site) {
        handleDeleteSite(siteId);
      }
    };

    return () => {
      window.editSite = undefined;
      window.deleteSite = undefined;
    };
  }, [sites]);

  const loadSites = async () => {
    try {
      const response = await fetch('/api/sites');
      const data = await response.json();
      setSites(data);
      renderSitesOnMap(data);
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

  const renderSitesOnMap = (sitesData) => {
    if (!map) return;

    sitesData.forEach(site => {
      const marker = L.marker([site.lat, site.lng], {
        icon: L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwN0YwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDEzLjc0TDEyIDIwTDEwLjkxIDEzLjc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRkY2QjZCIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=',
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          className: 'darkened-marker'
        })
      });

      marker.bindPopup(`
        <div>
          <h4>${site.name}</h4>
          <p>${site.description}</p>
          <p><strong>Lat:</strong> ${site.lat}</p>
          <p><strong>Lng:</strong> ${site.lng}</p>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-sm btn-warning" onclick="window.editSite('${site._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="window.deleteSite('${site._id}')">Delete</button>
          </div>
        </div>
      `);

      marker.addTo(map);
    });
  };

  const handleDeleteSite = async (siteId) => {
    if (!window.confirm('Are you sure you want to delete this site?')) return;
    
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete site');
      }

      // Ensure sites is always an array before filtering
      const sitesArray = Array.isArray(sites) ? sites : [];
      setSites(prev => prev.filter(s => s._id !== siteId));
      layerGroup.clearLayers();
      renderSitesOnMap(sitesArray.filter(s => s._id !== siteId));
    } catch (error) {
      setError(error.message || 'Failed to delete site');
      console.error('Error deleting site:', error);
    }
  };

  const handleEditClick = (site) => {
    setEditingSite(site);
    setNewSite({
      name: site.name,
      lat: site.lat,
      lng: site.lng,
      description: site.description,
      type: site.type,
      status: site.status,
      address: site.address,
      contact: site.contact
    });
    setShowAddForm(true);
  };

  const handleAddSite = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate coordinates
    const lat = parseFloat(newSite.lat);
    const lng = parseFloat(newSite.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numeric coordinates');
      setLoading(false);
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError('Invalid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180');
      setLoading(false);
      return;
    }

    const siteData = {
      ...newSite,
      lat,
      lng
    };

    const method = editingSite ? 'PUT' : 'POST';
    const url = editingSite ? `/api/sites/${editingSite._id}` : '/api/sites';
    
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to add site');
      }
      
      if (editingSite) {
        setSites(prev => prev.map(s => s._id === editingSite._id ? result.site : s));
      } else {
        setSites(prev => [...prev, result.site]);
      }
      
      // Ensure sites is always an array before mapping
      const sitesArray = Array.isArray(sites) ? sites : [];
      layerGroup.clearLayers();
      renderSitesOnMap(editingSite ?
        sitesArray.map(s => s._id === editingSite._id ? result.site : s) :
        [...sitesArray, result.site]
      );
      
      setNewSite({ name: '', lat: '', lng: '', description: '', type: 'office', status: 'active', address: '', contact: '' });
      setShowAddForm(false);
      setEditingSite(null);
      onSiteAdded(result.site);
    } catch (error) {
      setError(error.message || 'Failed to add site');
      console.error('Error adding site:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) => {
    if (!map) return;
    
    const { lat, lng } = e.latlng;
    setNewSite(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    setShowAddForm(true);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowAddForm(true)}
        >
          Add New Site
        </button>
      </div>

      {showAddForm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5>{editingSite ? 'Edit Site' : 'Add New Site'}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddForm(false)}
                ></button>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddSite}>
                  <div className="mb-3">
                    <label className="form-label">Site Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={newSite.name} 
                      onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Latitude</label>
                    <input 
                      type="number" 
                      step="0.000001"
                      className="form-control" 
                      value={newSite.lat} 
                      onChange={(e) => setNewSite({...newSite, lat: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Longitude</label>
                    <input 
                      type="number" 
                      step="0.000001"
                      className="form-control" 
                      value={newSite.lng} 
                      onChange={(e) => setNewSite({...newSite, lng: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      value={newSite.description} 
                      onChange={(e) => setNewSite({...newSite, description: e.target.value})}
                      rows="3"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button 
                      type="button" 
                      className="btn btn-secondary me-2" 
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (editingSite ? 'Updating...' : 'Adding...') : (editingSite ? 'Update Site' : 'Add Site')}
                    </button>
                  </div>
    
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger mt-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default SiteManager;
