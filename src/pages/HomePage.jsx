import React from 'react';
import Layout from '../styles/Layout.jsx';
import MainText from '../components/homepage/MainText.jsx';
import AuditorsProjectsSection from '../components/homepage/auditors-projects-section/AuditorsProjectsSection.jsx';
import Carousel from '../components/homepage/carousel/Carousel.jsx';
import theme from '../styles/themes.js';

const HomePage = () => {
  return (
    <Layout sx={layout}>
      <MainText />
      <AuditorsProjectsSection />
      <Carousel />
    </Layout>
  );
};
//
export default HomePage;

const layout = {
  flexDirection: 'column',
  padding: '0',
  paddingTop: '30px',
  [theme.breakpoints.down('md')]: {
    padding: 0,
  },
};
