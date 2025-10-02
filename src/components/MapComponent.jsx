import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useAuth } from '../context/AuthContext';
import { useSites } from '../context/SitesContext';
import SiteLinkManager from './map/SiteLinkManager';

const MapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const { sites, loadSites, deleteSite, updateSite } = useSites();
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
    connections: L.layerGroup(),
  });

  // Init map
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

    L.control
      .layers(baseLayers, groupsRef.current)
      .addTo(leafletMap);

    Object.values(groupsRef.current).forEach((g) => g.addTo(leafletMap));

    loadSites();

    return () => leafletMap.remove();
  }, []);

  // Render site markers
  useEffect(() => {
    if (!map) return;
    groupsRef.current.site.clearLayers();

    // Ensure sites is always an array before iterating
    const sitesArray = Array.isArray(sites) ? sites : [];

    sitesArray.forEach((site) => {
      if (!site.latitude || !site.longitude) return;
      const marker = L.marker([site.latitude, site.longitude]);
      marker.bindPopup(`<b>${site.name}</b><br/>${site.description || ''}`);
      groupsRef.current.site.addLayer(marker);
    });
  }, [sites, map]);

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
            {Array.isArray(sites) ? sites.length : 0} Sites
          </span>
          {role && ['admin', 'tech'].includes(role) && (
            <span className="badge bg-info">
              <i className="bi bi-cursor me-1"></i>
              Click to Add Site
            </span>
          )}
        </div>
      </div>
      
      <div 
        id="map" 
        ref={mapRef} 
        style={{ 
          height: 'calc(100vh - 200px)',
          minHeight: '400px',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }} 
        className="shadow-sm"
      />
      
      {Array.isArray(sites) && sites.length > 0 && (
        <SiteLinkManager
          map={map}
          sites={sites}
          layerGroup={groupsRef.current.connections}
        />
      )}
      
      <style jsx>{`
        @media (max-width: 768px) {
          #map {
            height: calc(100vh - 180px) !important;
            min-height: 350px !important;
          }
        }
        
        @media (max-width: 576px) {
          #map {
            height: calc(100vh - 160px) !important;
            min-height: 300px !important;
          }
        }
        
        /* Ensure leaflet controls are touch-friendly */
        .leaflet-control-zoom a {
          width: 44px !important;
          height: 44px !important;
          line-height: 44px !important;
          font-size: 18px !important;
        }
        
        .leaflet-control-layers {
          font-size: 14px !important;
        }
        
        /* Better mobile popup styling */
        .leaflet-popup-content {
          margin: 10px 15px !important;
          font-size: 14px !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;