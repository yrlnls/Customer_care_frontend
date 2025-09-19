import { createContext, useContext, useState, useEffect } from 'react';

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

  const API_URL = "http://localhost:5000/api";

  const getData = async () => {
    try {
      setLoading(true);

      const [usersRes, ticketsRes, clientsRes, routersRes, metricsRes] =
        await Promise.all([
          fetch(`${API_URL}/users`),
          fetch(`${API_URL}/tickets`),
          fetch(`${API_URL}/clients`),
          fetch(`${API_URL}/routers`),
          fetch(`${API_URL}/metrics`)
        ]);

      if (!usersRes.ok || !ticketsRes.ok || !clientsRes.ok || !routersRes.ok || !metricsRes.ok) {
        throw new Error("Failed to fetch one or more resources");
      }

      const [usersData, ticketsData, clientsData, routersData, metricsData] =
        await Promise.all([
          usersRes.json(),
          ticketsRes.json(),
          clientsRes.json(),
          routersRes.json(),
          metricsRes.json()
        ]);

      setUsers(usersData);
      setTickets(ticketsData);
      setClients(clientsData);
      setRouters(routersData);
      setMetrics(metricsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Example CRUD using API
  const addUser = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error("Failed to add user");
      const newUser = await res.json();
      setUsers(prev => [...prev, newUser]);
      return { success: true };
    } catch (error) {
      console.error("Error adding user:", error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updatedUser = await res.json();
      setUsers(prev => prev.map(u => (u.id === userId ? updatedUser : u)));
      return { success: true };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
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
