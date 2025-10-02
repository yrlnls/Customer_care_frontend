import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser).role : null;
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Separate useEffect for localStorage sync to avoid circular dependency
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      setUserRole(user.role);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      setUserRole(null);
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { access_token, user: userData } = response.data;

      // Set token and user data
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setUser(userData);
      setUserRole(userData.role);

      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear localStorage first
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');

    // Then clear state
    setUser(null);
    setUserRole(null);

    toast.info('Logged out successfully');
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
