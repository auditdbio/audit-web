import React from 'react';
import { Link } from 'react-router-dom/dist';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import theme from '../../styles/themes.js';
import Logo from '../icons/Logo.jsx';
import AuthorizedOptions from './AuthorizedOptions.jsx';
import UnauthorizedOptions from './UnauthorizedOptions.jsx';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container sx={container}>
        <Toolbar disableGutters>
          <Box sx={wrapper}>
            <Link
              to={'/'}
              style={linkStyle}
              aria-label="Homepage"
              {...addTestsLabel('header_logo-link')}
            >
              <Box sx={logoStyle}>
                <Logo />
              </Box>
            </Link>
            {!isAuth() && <UnauthorizedOptions />}
            {isAuth() && <AuthorizedOptions />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const container = {
  maxWidth: '1512px',
  paddingTop: '20px',
  [theme.breakpoints.down('xs')]: {
    paddingTop: '20px',
  },
};

const wrapper = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: !isAuth() ? '16px' : '10px',
};

const linkStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const logoStyle = {
  height: '50px',
  width: '200px',
  marginY: 'auto',
  [theme.breakpoints.down('sm')]: {
    height: '40px',
    width: '160px',
  },
};

export default Header;
