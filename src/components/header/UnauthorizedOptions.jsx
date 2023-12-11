import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom/dist';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import theme from '../../styles/themes.js';
import CustomMenu from '../custom/CustomMenu.jsx';
import { CustomButton } from '../custom/Button.jsx';
import { pages } from './constants.js';
import { addTestsLabel } from '../../lib/helper.js';

const UnauthorizedOptions = () => {
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  const handleSignUp = () => {
    navigate('/sign-up');
  };

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = path => {
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/*  Mobile Screen  */}
      {matchSm && (
        <Box sx={{ flexGrow: 0, display: 'flex' }}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon fontSize="large" />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            keepMounted
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={!!anchorElNav}
            onClose={handleCloseNavMenu}
            sx={{ display: 'block' }}
            PaperProps={{
              sx: { width: '300px', borderRadius: '15px' },
            }}
          >
            <MenuItem sx={{ marginTop: '1rem' }}>
              <Box sx={authBlock}>
                <CustomButton sx={signInButton} onClick={handleSignIn}>
                  Sign In
                </CustomButton>
                <CustomButton sx={signUpButton} onClick={handleSignUp}>
                  Sign Up
                </CustomButton>
              </Box>
            </MenuItem>
            {pages.map(page =>
              page.menuOptions.map(el => (
                <MenuItem
                  key={el.id}
                  onClick={() => handleNavigate(el.link)}
                  sx={mobileMenuOption}
                >
                  <Box textAlign="center" sx={popupLinkSx}>
                    {el.itemName}
                  </Box>
                </MenuItem>
              )),
            )}
          </Menu>
        </Box>
      )}

      {/*  Desktop Screen  */}
      {!matchSm && (
        <>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            {pages.map(page => (
              <CustomMenu
                key={page.id}
                options={page.menuOptions}
                buttonText={page.name}
              />
            ))}
          </Box>
          <Box sx={desktopAuthBlock}>
            <CustomButton
              sx={signInButton}
              onClick={handleSignIn}
              {...addTestsLabel('header_sign-in-button')}
            >
              Sign In
            </CustomButton>
            <CustomButton
              sx={signUpButton}
              onClick={handleSignUp}
              {...addTestsLabel('header_sign-up-button')}
            >
              Sign Up
            </CustomButton>
          </Box>
        </>
      )}
    </>
  );
};

const authBlock = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '1rem',
  marginX: '1rem',
};

const desktopAuthBlock = {
  flexGrow: 1,
  maxWidth: '320px',
  display: 'flex',
  gap: '1rem',
};

const signInButton = {
  backgroundColor: 'orange',
  color: 'white',
  border: '3px solid orange',
  ':hover': {
    backgroundColor: 'orange',
    transition: '0.2s',
    filter: 'brightness(90%)',
    color: 'white',
  },
};

const signUpButton = {
  backgroundColor: 'transparent',
  color: '#222',
  border: '3px solid #52176D',
  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, .1)',
    color: 'black',
  },
};

const mobileMenuOption = {
  minHeight: '48px',
  paddingY: 0,
  ':active': {
    backgroundColor: 'orange',
    color: 'color',
  },
  [theme.breakpoints.down('xs')]: {
    minHeight: '40px',
  },
};

const popupLinkSx = {
  marginX: '1rem',
  fontSize: '18px',
  fontWeight: '500',
};

export default UnauthorizedOptions;
