import React from 'react';
import { ContentWrapper } from './themes.js';
import Header from '../components/header/Header.jsx';
import Box from '@mui/material/Box';
import Footer from '../components/footer/Footer.jsx';

const Layout = ({ children, sx, containerSx }) => {
  return (
    <ContentWrapper>
      <Header containerSx={containerSx} />
      <Box sx={[layoutStyle, sx]} component="main">
        {children}
      </Box>
      <Footer containerSx={containerSx} />
    </ContentWrapper>
  );
};

export default Layout;

const layoutStyle = theme => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  padding: '10px!important',
  [theme.breakpoints.down(780)]: {
    padding: '10px 0!important',
  },
});
