import { Navigate } from 'react-router-dom/dist';
import { useEffect } from 'react';

export const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem('isPublic');
    }
  }, []);
  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};
