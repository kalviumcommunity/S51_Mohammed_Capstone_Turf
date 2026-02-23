import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './UserProvider';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;