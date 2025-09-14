import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useAuth } from '../context/AuthContext';
import SiteLinkManager from './map/SiteLinkManager';
import { sitesAPI } from '../services/api';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [sites, setSites] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [newSite, setNewSite] = useState({
    name: '',
    latitude: '',
    longitude: '',
    description: ''
  });
  const { userRole: role } = useAuth();
  const canAddRouter = role === 'admin' || role === 'tech';
  
  const groupsRef = useRef({
    route_point: L.layerGroup(),
    closure: L.layerGroup(),
    building: L.layerGroup(),
    client: L.layerGroup(),
    fat: L.layerGroup(),
    switch: L.layerGroup(),
    adapter: L.layerGroup(),
    site: L.layerGroup(),
    router: L.layerGroup(),
    connections: L.layerGroup() // New layer for site connections
  });

  useEffect(() => {
    if (!mapRef.current) return;

    const leafletMap = L.map(mapRef.current).setView([-1.312, 36.822], 16);
    setMap(leafletMap);

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OSM'
    });
    
    const esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '© Esri'
    });

    const baseLayers = { "OpenStreetMap": osm, "Satellite": esri };
    osm.addTo(leafletMap);

    const overlays = {
      'Routes': groupsRef.current.route_point,
      'Closures': groupsRef.current.closure,
      'Buildings': groupsRef.current.building,
      'Clients': groupsRef.current.client,
      'FATs': groupsRef.current.fat,
      'Switches': groupsRef.current.switch,
      'Adapter Boxes': groupsRef.current.adapter,
      'Sites': groupsRef.current.site,
      'Routers': groupsRef.current.router,
      'Connections': groupsRef.current.connections // Add connections to layer control
    };

    Object.values(groupsRef.current).forEach(group => group.addTo(leafletMap));
    L.control.layers(baseLayers, overlays).addTo(leafletMap);

    // Geolocation: center map on user location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          leafletMap.setView([latitude, longitude], 16);
        },
        (error) => {
          console.warn('Geolocation error:', error);
        }
      );
    }

    // Load sites
    loadSites(leafletMap);

    return () => {
      leafletMap.remove();
      Object.values(groupsRef.current).forEach(group => group.clearLayers());
    };
  }, []);

  const loadSites = async (leafletMap) => {
    try {
      const response = await sitesAPI.getAll();
      const apiSites = response.data;

      setSites(apiSites);

      // Add site markers to map
      apiSites.forEach(site => {
        const siteIcon = L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJMMTkuNjYgMTAuOTg3TDI5LjMzIDEzTDIwLjY2IDIwLjYxM0wxNiAzMEwxMS4zNCAyMC42MTNMMi42NyAxM0wxMi4zNCAxMC45ODdMMTYgMloiIGZpbGw9IiM0M0ZGMDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4=',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          className: 'pulsing-marker'
        });

        const marker = L.marker([site.latitude, site.longitude], { icon: siteIcon });

        marker.bindPopup(`
          <div style="min-width: 200px;">
            <h5>${site.name}</h5>
            <p>${site.description}</p>
            <p><strong>Coordinates:</strong><br>
            Lat: ${site.latitude}<br>
            Lng: ${site.longitude}</p>
            <button class="btn btn-sm btn-primary" onclick="window.editSite(${site.id})">Edit</button>
            <button class="btn btn-sm btn-danger ms-2" onclick="window.deleteSite(${site.id})">Delete</button>
          </div>
        `);

        groupsRef.current.site.addLayer(marker);
      });
    } catch (error) {
      console.error('Error loading sites:', error);
    }
  };

  const loadData = () => {
    fetch('/api/map-data')
      .then(r => r.json())
      .then(items => {
        Object.values(groupsRef.current).forEach(g => g.clearLayers());
        const routeCoords = [];
        items.forEach(i => {
          if (i.type !== 'route_point') {
            const marker = L.circleMarker([i.lat, i.lng], { radius: 6 });
            marker.bindPopup(`<b>${i.type}</b><br>${i.name}`);
            groupsRef.current[i.type]?.addLayer(marker);
          }
          if (i.type === 'route_point') routeCoords.push([i.lat, i.lng]);
        });
        if (routeCoords.length) {
          L.Routing.control({
  waypoints: routeCoords.map(coord => L.latLng(coord[0], coord[1])),
  routeWhileDragging: false,
  showAlternatives: false,
  lineOptions: {
    styles: [{ color: '#00a8ff', weight: 6, opacity: 0.8 }],
    extendToWaypoints: true,
    missingRouteTolerance: 10
  },
  createMarker: () => null
}).addTo(groupsRef.current.route_point);
        }
      });
  };

  const handleAddSite = async (e) => {
    e.preventDefault();

    const siteData = {
      ...newSite,
      latitude: parseFloat(newSite.latitude),
      longitude: parseFloat(newSite.longitude)
    };

    try {
      if (editingSite) {
        // Update existing site via API
        await sitesAPI.update(editingSite.id, siteData);

        // Reload sites from API
        await loadSites(map);
      } else {
        // Add new site via API
        await sitesAPI.create(siteData);

        // Reload sites from API
        await loadSites(map);
      }

      setNewSite({ name: '', latitude: '', longitude: '', description: '' });
      setShowAddForm(false);
      setEditingSite(null);
    } catch (error) {
      console.error('Error adding/updating site:', error);
    }
  };

  const handleMapClick = (e) => {
    if (!map) return;

    const { lat, lng } = e.latlng;
    setNewSite(prev => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    setShowAddForm(true);
  };

  useEffect(() => {
    if (!map) return;
    
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map]);

  // Expose edit and delete functions to global scope for popup buttons
  useEffect(() => {
    window.editSite = (siteId) => {
      const site = sites.find(s => s.id === siteId);
      if (site) {
        // Open edit form with site data
        setNewSite({
          name: site.name,
          latitude: site.latitude.toString(),
          longitude: site.longitude.toString(),
          description: site.description || ''
        });
        setShowAddForm(true);
        setEditingSite(site);
      }
    };

    window.deleteSite = async (siteId) => {
      const site = sites.find(s => s.id === siteId);
      if (site && confirm(`Are you sure you want to delete site: ${site.name}?`)) {
        try {
          await sitesAPI.delete(siteId);
          // Reload sites from API
          await loadSites(map);
          alert(`Site ${site.name} has been deleted.`);
        } catch (error) {
          console.error('Error deleting site:', error);
          alert('Error deleting site. Please try again.');
        }
      }
    };

    return () => {
      window.editSite = undefined;
      window.deleteSite = undefined;
    };
  }, [sites, map]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSearchResult = (result) => {
    if (map) {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      map.setView([lat, lon], 16);
      setSearchQuery(result.display_name);
      setSearchResults([]);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleSearch}
            style={{ position: 'absolute', right: '5px', top: '5px' }}
          >
            Search
          </button>
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                  onClick={() => selectSearchResult(result)}
                >
                  {result.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
        {role && ['admin', 'tech'].includes(role) && (
          <>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(true)}
            >
              Add Site
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => {
                if (map) {
                  map.on('click', handleMapClick);
                  alert('Click on the map to add a site at that location');
                }
              }}
            >
              Add Site (Click Map)
            </button>
          </>
        )}
        {canAddRouter && (
          <button className="btn btn-primary" onClick={() => { }}>
            Add Router
          </button>
        )}
      </div>

      {/* Site Link Manager Component */}
      {sites.length > 0 && (
        <SiteLinkManager 
          map={map}
          sites={sites}
          layerGroup={groupsRef.current.connections}
        />
      )}
      
      {showAddForm && (
        <div className="card mb-3">
          <div className="card-header">
            <h5>{editingSite ? 'Edit Site' : 'Add New Site'}</h5>
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
                  value={newSite.latitude}
                  onChange={(e) => setNewSite({...newSite, latitude: e.target.value})}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="form-control"
                  value={newSite.longitude}
                  onChange={(e) => setNewSite({...newSite, longitude: e.target.value})}
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
              <button type="submit" className="btn btn-primary">
                {editingSite ? 'Update Site' : 'Add Site'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary ms-2" 
                onClick={() => {
                  setShowAddForm(false);
                  setEditingSite(null);
                  setNewSite({ name: '', latitude: '', longitude: '', description: '' });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div id="map" ref={mapRef} style={{ height: '70vh', width: '100%' }} />
    </div>
  );
};

export default MapComponent;
