import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';

const DoctorRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext);
  
  // If no doctor token, redirect to doctor login
  if (!dToken) {
    return <Navigate to="/doctor/login" replace />;
  }
  
  return children;
};

export default DoctorRoute;