import React from 'react';
import Layout from '../styles/Layout.jsx';
import PublicProfile from './Public-profile.jsx';

const PublicProfilePage = () => {
  return (
    <Layout sx={{ flexDirection: 'column' }}>
      <PublicProfile />
    </Layout>
  );
};

export default PublicProfilePage;
