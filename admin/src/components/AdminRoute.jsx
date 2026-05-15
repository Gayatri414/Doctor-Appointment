import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

const AdminProtectedRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  
  // If no admin token, redirect to admin login
  if (!aToken) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

export default AdminProtectedRoute;