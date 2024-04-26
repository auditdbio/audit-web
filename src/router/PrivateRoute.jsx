import { Navigate } from 'react-router-dom/dist';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader.jsx';
import Layout from '../styles/Layout.jsx';
import { Box } from '@mui/material';

export const PrivateRoute = ({ auth: { isAuthenticated }, children }) => {
  const loading = useSelector(s => s.user.loading);
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.removeItem('isPublic');
    }
  }, []);

  if (loading) {
    return (
      <Layout>
        <Box>
          <Loader />
        </Box>
      </Layout>
    );
  }

  return isAuthenticated ? children : <Navigate to="/sign-in" />;
};
