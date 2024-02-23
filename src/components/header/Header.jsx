import React from 'react';
import { Link } from 'react-router-dom/dist';
import { useMediaQuery } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Logo from '../icons/Logo.jsx';
import AuthorizedOptions from './AuthorizedOptions.jsx';
import UnauthorizedOptions from './UnauthorizedOptions.jsx';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
import ChatLabel from '../Chat/ChatLabel.jsx';
import theme from '../../styles/themes.js';

const Header = () => {
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container sx={container}>
        <Toolbar disableGutters>
          <Box sx={wrapper}>
            <Box sx={leftSide}>
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
              {/*{isAuth() && !matchXs && <ChatLabel />}*/}
            </Box>
            {isAuth() && <AuthorizedOptions />}
            {!isAuth() && <UnauthorizedOptions />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

const container = theme => ({
  maxWidth: '1512px',
  paddingTop: '20px',
  [theme.breakpoints.down('xs')]: {
    paddingTop: 0,
  },
});

const wrapper = theme => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
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
  height: '50px',
  width: '200px',
  marginY: 'auto',
  mr: '50px',
  [theme.breakpoints.down('sm')]: {
    height: '40px',
    width: '160px',
    mr: '20px',
  },
  [theme.breakpoints.down('xs')]: {
    height: '35px',
    width: '140px',
    mr: 0,
  },
  [theme.breakpoints.down('xxs')]: {
    height: '30px',
    width: '120px',
  },
});

export default Header;
