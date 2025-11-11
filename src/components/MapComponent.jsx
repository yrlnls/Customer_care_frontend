import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, Polyline, useLoadScript } from '@react-google-maps/api';
import { useAuth } from '../context/AuthContext';
import { useSites } from '../context/SitesContext';
import AddSiteModal from './sites/AddSiteModal';

const MapComponent = () => {
  const { sites, loadSites, addSite } = useSites();
  const { userRole: role } = useAuth();
  const canAddSite = role === 'admin' || role === 'tech';
  const mapRef = useRef(null);

  const [selectedSite, setSelectedSite] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [clickedLatLng, setClickedLatLng] = useState(null);
  const [visibleLayers, setVisibleLayers] = useState({
    office: true,
    branch: true,
    datacenter: true,
    warehouse: true,
    remote: true,
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = { lat: -1.312, lng: 36.822 };

  const mapContainerStyle = {
    height: 'calc(100vh - 200px)',
    minHeight: '400px',
    width: '100%',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  };

  const options = {
    zoom: 16,
    center: center,
    mapTypeId: 'satellite',
    mapTypeControl: true,
  };

  // Auto-fit map to show all sites when sites are loaded
  useEffect(() => {
    if (isLoaded && mapRef.current?.map && sites && sites.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      sites.forEach(site => {
        const lat = parseFloat(site.latitude || site.lat);
        const lng = parseFloat(site.longitude || site.lng);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend({ lat, lng });
        }
      });
      // Only fit bounds if we have valid coordinates
      if (!bounds.isEmpty()) {
        mapRef.current.map.fitBounds(bounds);
        // Optional: Set a minimum zoom level to avoid zooming in too much
        const listener = window.google.maps.event.addListener(mapRef.current.map, 'idle', () => {
          if (mapRef.current.map.getZoom() > 16) {
            mapRef.current.map.setZoom(16);
          }
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  }, [sites, isLoaded]);

  const siteTypeColors = {
    office: '#007bff', // blue
    branch: '#28a745', // green
    datacenter: '#6f42c1', // purple
    warehouse: '#fd7e14', // orange
    remote: '#6c757d', // gray
  };

  const getMarkerIcon = (color) => ({
    path: 'M 0,-1 0,-7 8,0 z', // Simple pin shape
    scale: 6,
    fillColor: color,
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2,
  });

  const handleLayerToggle = (type) => {
    setVisibleLayers(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const onMapClick = useCallback((event) => {
    if (canAddSite) {
      setClickedLatLng({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
      setAddModalOpen(true);
    }
  }, [canAddSite]);

  const handleAddSite = async (siteData) => {
    try {
      await addSite(siteData);
      setAddModalOpen(false);
      setClickedLatLng(null);
    } catch (err) {
      console.error('Error adding site:', err);
    }
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  // Ensure sites is always an array before iterating
  const sitesArray = Array.isArray(sites) ? sites : [];

  // Filter visible sites
  const visibleSitesArray = sitesArray.filter(site => visibleLayers[site.type || 'office']);

  // Polyline path for visible sites
  const polylinePath = visibleSitesArray.length > 1 ? visibleSitesArray
    .map(site => ({
      lat: parseFloat(site.latitude || site.lat),
      lng: parseFloat(site.longitude || site.lng)
    })) : [];

  return (
    <div className="map-container">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h4 className="mb-0">
          <i className="bi bi-geo-alt me-2"></i>
          Network Map
        </h4>
        <div className="d-flex gap-2 flex-wrap">
          <span className="badge bg-primary">
            <i className="bi bi-geo-alt me-1"></i>
            {visibleSitesArray.length} Sites
          </span>
          {canAddSite && (
            <span className="badge bg-info">
              <i className="bi bi-cursor me-1"></i>
              Click to Add Site
            </span>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-3">
          <div className="card h-100">
            <div className="card-header">
              <h6 className="mb-0">Toggle Layers</h6>
            </div>
            <div className="card-body p-2">
              {Object.keys(visibleLayers).map(type => (
                <div key={type} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`layer-${type}`}
                    checked={visibleLayers[type]}
                    onChange={() => handleLayerToggle(type)}
                  />
                  <label className="form-check-label" htmlFor={`layer-${type}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <GoogleMap
            ref={mapRef}
            mapContainerStyle={mapContainerStyle}
            zoom={16}
            center={center}
            options={options}
            onClick={onMapClick}
            className="shadow-sm"
          >
            {visibleSitesArray.map((site) => {
              if ((!site.latitude && !site.lat) || (!site.longitude && !site.lng)) return null;
              const siteColor = siteTypeColors[site.type || 'office'];
              return (
                <Marker
                  key={site.id}
                  position={{ lat: parseFloat(site.latitude || site.lat), lng: parseFloat(site.longitude || site.lng) }}
                  icon={getMarkerIcon(siteColor)}
                  onClick={() => setSelectedSite(site)}
                />
              );
            })}

            {selectedSite && (
              <InfoWindow
                position={{ lat: parseFloat(selectedSite.latitude || selectedSite.lat), lng: parseFloat(selectedSite.longitude || selectedSite.lng) }}
                onCloseClick={() => setSelectedSite(null)}
              >
                <div>
                  <h5>{selectedSite.name}</h5>
                  <p>{selectedSite.description || 'No description'}</p>
                  <small>Type: {selectedSite.type}</small><br />
                  <small>Status: {selectedSite.status}</small>
                </div>
              </InfoWindow>
            )}

            {polylinePath.length > 1 && (
              <Polyline
                path={polylinePath}
                options={{
                  strokeColor: '#0000FF',
                  strokeOpacity: 1.0,
                  strokeWeight: 3,
                }}
              />
            )}
          </GoogleMap>

          <div className="mt-3">
            <h6>Legend</h6>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(siteTypeColors).map(([type, color]) => (
                <div key={type} className="d-flex align-items-center gap-1">
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: color,
                      borderRadius: '50%',
                      border: '1px solid #ccc'
                    }}
                  ></div>
                  <small>{type.charAt(0).toUpperCase() + type.slice(1)}</small>
                </div>
              ))}
            </div>
          </div>

          <AddSiteModal
            isOpen={addModalOpen}
            onClose={() => {
              setAddModalOpen(false);
              setClickedLatLng(null);
            }}
            onSubmit={handleAddSite}
            initialData={clickedLatLng ? { lat: clickedLatLng.lat, lng: clickedLatLng.lng } : {}}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .map-container div[style*="height"] {
            height: calc(100vh - 180px) !important;
            min-height: 350px !important;
          }
        }

        @media (max-width: 576px) {
          .map-container div[style*="height"] {
            height: calc(100vh - 160px) !important;
            min-height: 300px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MapComponent;
