import React from 'react';
import { Link } from 'react-router-dom/dist';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
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
            <Box sx={leftSide}>
              <Link
                to="/"
                style={linkStyle}
                aria-label="Homepage"
                {...addTestsLabel('header_logo-link')}
              >
                <Box sx={logoStyle}>
                  <Logo />
                </Box>
              </Link>
            </Box>
            {isAuth() && <AuthorizedOptions />}
            {!isAuth() && <UnauthorizedOptions />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const container = {
  maxWidth: '1512px',
};

const wrapper = theme => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  [theme.breakpoints.down('xs')]: {
    gap: 0,
  },
});

const leftSide = {
  display: 'flex',
  alignItems: 'center',
};

const linkStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const logoStyle = theme => ({
  height: '40px',
  width: '160px',
  marginY: 'auto',
  mr: '50px',
  [theme.breakpoints.down('sm')]: {
    mr: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    height: '30px',
    width: '140px',
    mr: 0,
  },
  [theme.breakpoints.down('xxs')]: {
    height: '25px',
    width: '100px',
  },
});

export default Header;
