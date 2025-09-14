import { useContext } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';
import ManageUsersPage from '../pages/ManageUsersPage.jsx';

export const AdminRoute = () => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

 
};
