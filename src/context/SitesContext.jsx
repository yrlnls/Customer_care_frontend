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
      // Ensure we always set an array, even if API returns unexpected data
      const sitesData = Array.isArray(response.data) ? response.data : [];
      setSites(sitesData);
    } catch (err) {
      console.error('Error loading sites:', err);
      setError('Failed to load sites');
      // Ensure sites is always an array even on error
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  const addSite = async (siteData) => {
    try {
      // Transform lat/lng to latitude/longitude for backend compatibility
      const transformedData = {
        ...siteData,
        latitude: siteData.lat || siteData.latitude,
        longitude: siteData.lng || siteData.longitude,
      };
      delete transformedData.lat;
      delete transformedData.lng;

      const response = await sitesAPI.create(transformedData);
      setSites((prev) => [...prev, response.data]);
    } catch (err) {
      console.error('Error adding site:', err);
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
