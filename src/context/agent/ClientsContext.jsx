import React, { createContext, useState, useEffect, useContext } from 'react';

const ClientsContext = createContext();

export function useClients() {
  return useContext(ClientsContext);
}

export function ClientsProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch clients from backend on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/clients');
        if (!res.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await res.json();
        setClients(data.clients || data); // Adjust based on API response structure
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const addClient = async (clientData) => {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      const data = await res.json();
      if (res.ok) {
        setClients(prev => [...prev, data]);
        return { success: true };
      } else {
        alert(data.error || 'Failed to add client');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Error adding client');
      return { success: false, error: error.message };
    }
  };

  const updateClient = async (id, updatedClient) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient)
      });
      const data = await res.json();
      if (res.ok) {
        setClients(prev => prev.map(client =>
          client.id === id ? { ...client, ...data } : client
        ));
        return { success: true };
      } else {
        alert(data.error || 'Failed to update client');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client');
      return { success: false, error: error.message };
    }
  };

  const deleteClient = async (id) => {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setClients(prev => prev.filter(client => client.id !== id));
        return { success: true };
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete client');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client');
      return { success: false, error: error.message };
    }
  };

  const value = {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient
  };

  return (
    <ClientsContext.Provider value={value}>
      {children}
    </ClientsContext.Provider>
  );
}
