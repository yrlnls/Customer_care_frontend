import React, { useEffect } from 'react';
import L from 'leaflet';

const SiteLinkManager = ({ map, sites, layerGroup }) => {
  useEffect(() => {
    if (!map || !layerGroup) return;

    // Clear existing connections
    layerGroup.clearLayers();

    // Create routes between consecutive sites using OSRM
    // Ensure sites is always an array before iterating
    const sitesArray = Array.isArray(sites) ? sites : [];

    if (sitesArray.length > 1) {
      sitesArray.forEach((site, index) => {
        if (index < sitesArray.length - 1) {
          const nextSite = sitesArray[index + 1];
          L.Routing.control({
            waypoints: [
              L.latLng(site.lat, site.lng),
              L.latLng(nextSite.lat, nextSite.lng)
            ],
            router: L.Routing.osrmv1({
              serviceUrl: 'https://router.project-osrm.org/route/v1'
            }),
            lineOptions: {
              styles: [{color: '#007bff', weight: 5}],
              extendToWaypoints: false,
              missingRouteTolerance: 10
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            createMarker: () => null
          }).addTo(map);
        }
      });
    }
  }, [map, sites, layerGroup]);

  return null; // No UI needed for this functionality
};

export default SiteLinkManager;
