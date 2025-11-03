import React, { createContext, useContext, useEffect, useState } from 'react';
import { sitesAPI } from '../services/api';

const SitesContext = createContext();

export const SitesProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sitesAPI.getAll();
      console.log('Sites API Response:', response); // Debug log
      console.log('Full response.data structure:', JSON.stringify(response.data, null, 2)); // Detailed structure log
      // Handle common backend response structures
      let sitesData = [];
      if (Array.isArray(response.data)) {
        sitesData = response.data;
      } else if (Array.isArray(response.data.sites)) {
        sitesData = response.data.sites;
      } else if (Array.isArray(response.data.data)) {
        sitesData = response.data.data;
      } else {
        console.warn('Unexpected response structure, defaulting to empty array');
        sitesData = [];
      }
      console.log('Processed sitesData:', sitesData); // Debug log
      setSites(sitesData);
    } catch (err) {
      console.error('Error loading sites:', err);
      console.log('Full error details:', err.response?.data || err.message); // More detailed error log
      setError('Failed to load sites');
      // Ensure sites is always an array even on error
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  const addSite = async (siteData) => {
    try {
      console.log('Adding site with data:', siteData); // Debug log
      // Backend create expects 'latitude' and 'longitude', but get returns 'lat' and 'lng'
      const transformedData = {
        ...siteData,
        latitude: siteData.lat || siteData.latitude,
        longitude: siteData.lng || siteData.longitude,
      };
      // Remove any lat/lng if present to avoid confusion
      delete transformedData.lat;
      delete transformedData.lng;

      console.log('Transformed data for API:', transformedData); // Debug log
      const response = await sitesAPI.create(transformedData);
      console.log('Add site API response:', response); // Debug log
      console.log('New site added:', response.data); // Debug log
      // Since response.data likely has lat/lng, transform back for frontend consistency
      const frontendSite = {
        ...response.data,
        lat: response.data.lat || response.data.latitude,
        lng: response.data.lng || response.data.longitude,
      };
      setSites((prev) => [...prev, frontendSite]);
    } catch (err) {
      console.error('Error adding site:', err);
      console.log('Full add site error:', err.response?.data || err.message); // Detailed error log
      throw err;
    }
  };

  const updateSite = async (id, siteData) => {
    try {
      const response = await sitesAPI.update(id, siteData);
      setSites((prev) =>
        prev.map((site) => (site.id === id ? response.data : site))
      );
    } catch (err) {
      console.error('Error updating site:', err);
      throw err;
    }
  };

  const deleteSite = async (id) => {
    try {
      await sitesAPI.delete(id);
      setSites((prev) => prev.filter((site) => site.id !== id));
    } catch (err) {
      console.error('Error deleting site:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  return (
    <SitesContext.Provider
      value={{
        sites,
        loading,
        error,
        loadSites,
        addSite,
        updateSite,
        deleteSite,
      }}
    >
      {children}
    </SitesContext.Provider>
  );
};

export const useSites = () => useContext(SitesContext);
