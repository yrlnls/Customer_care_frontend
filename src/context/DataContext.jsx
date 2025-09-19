import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DataContext = createContext();
export { DataContext };

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [clients, setClients] = useState([]);
  const [routers, setRouters] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use axios api instance so we get consistent baseURL and auth headers
      const [usersRes, ticketsRes, clientsRes, routersRes, metricsRes] = await Promise.all([
        api.get('/users'),
        api.get('/tickets'),
        api.get('/clients'),
        api.get('/routers'),
        api.get('/metrics')
      ]);

      setUsers(usersRes.data || []);
      setTickets(ticketsRes.data || []);
      setClients(clientsRes.data || []);
      setRouters(routersRes.data || []);
      setMetrics(metricsRes.data || {});
      setLoading(false);
    } catch (err) {
      // Normalize error message
      const message = err.response?.data?.error || err.message || 'Failed to load data';
      console.error('DataContext.getData error:', err);
      setError(message);
      setLoading(false);
    }
  };

  // Example CRUD using shared api instance
  const addUser = async (userData) => {
    try {
      const res = await api.post('/users', userData);
      const newUser = res.data;
      setUsers(prev => [...prev, newUser]);
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const res = await api.put(`/users/${userId}`, userData);
      const updatedUser = res.data;
      setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <DataContext.Provider value={{
      users,
      tickets,
      clients,
      routers,
      metrics,
      loading,
      error,
      getData,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Optional: hook to use context
export const useData = () => useContext(DataContext);
