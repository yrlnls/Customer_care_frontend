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

    const osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { maxZoom: 19, attribution: '© OSM' }
    );
    osm.addTo(leafletMap);

    const esri = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, attribution: '© Esri' }
    );

    L.control
      .layers({ OpenStreetMap: osm, Satellite: esri }, groupsRef.current)
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
    <div>
      <div id="map" ref={mapRef} style={{ height: '70vh', width: '100%' }} />
      {Array.isArray(sites) && sites.length > 0 && (
        <SiteLinkManager
          map={map}
          sites={sites}
          layerGroup={groupsRef.current.connections}
        />
      )}
    </div>
  );
};

export default MapComponent;
