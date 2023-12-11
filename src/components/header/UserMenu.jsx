import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { changeRole, logout } from '../../redux/actions/userAction.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom/dist';
import { useSelector } from 'react-redux';
import React from 'react';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import { ASSET_URL } from '../../services/urls.js';
import theme from '../../styles/themes.js';
import { addTestsLabel } from '../../lib/helper.js';

export const UserMenu = ({ open, handleClose, anchor, userAvatar, pages }) => {
  const dispatch = useDispatch();
  const reduxUser = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const currentRole = useSelector(s => s.user.user.current_role);

  const user = {
    fullName: reduxUser.name || '',
    tags: reduxUser.interests || '',
    email: reduxUser.email || '',
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMyAccountClick = () => {
    navigate('/profile/user-info');
  };

  return (
    <Menu
      anchorEl={anchor}
      id="account-menu"
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={menuPaperProps}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'center' }}
    >
      <MenuItem onClick={handleClose}>
        <Box sx={userInfoSx}>
          <Avatar
            src={userAvatar ? `${ASSET_URL}/${userAvatar}` : ''}
            sx={avatarSx}
            alt="User photo"
          />
          <Typography sx={mainTextStyle}>{user.fullName}</Typography>
          <Typography sx={secondaryTextStyle}>{user.email}</Typography>
        </Box>
      </MenuItem>
      <Tabs
        value={reduxUser.current_role}
        onChange={(e, newValue) => {
          dispatch(changeRole(newValue, reduxUser.id));
        }}
        name="role"
        sx={tabsSx}
        indicatorColor="none"
      >
        <Tab
          value={AUDITOR}
          sx={[
            reduxUser.current_role === AUDITOR ? auditorTabSx : inactiveTabSx,
            tabSx,
          ]}
          label="Auditor"
          {...addTestsLabel('header_auditor-button')}
        />
        <Tab
          value={CUSTOMER}
          sx={[
            reduxUser.current_role === CUSTOMER ? customerTabSx : inactiveTabSx,
            tabSx,
          ]}
          label="Customer"
          {...addTestsLabel('header_customer-button')}
        />
      </Tabs>

      <MenuItem onClick={handleClose}>
        <Button
          sx={popupLinkSx(reduxUser.current_role)}
          onClick={handleMyAccountClick}
          {...addTestsLabel('header_my-account')}
        >
          My account
        </Button>
      </MenuItem>
      {matchSm &&
        pages?.map(el =>
          el.menuOptions
            .filter(item => item.role === currentRole)
            .map((page, index) => (
              <MenuItem key={index} onClick={handleClose}>
                <Button
                  sx={popupLinkSx(reduxUser.current_role)}
                  onClick={() => navigate(page.link)}
                  {...addTestsLabel(`header_usermenu-${page.itemName}`)}
                >
                  {page.itemName}
                </Button>
              </MenuItem>
            )),
        )}
      <MenuItem onClick={handleClose}>
        <Button
          onClick={handleLogout}
          sx={[
            {
              width: '100%',
              textTransform: 'none',
              borderBottom: 'unset!important',
            },
            popupLinkSx(reduxUser.current_role),
          ]}
          disableRipple
          {...addTestsLabel('header_logout-button')}
        >
          Logout
        </Button>
      </MenuItem>
    </Menu>
  );
};

const menuPaperProps = {
  elevation: 0,
  sx: {
    overflow: 'visible',
    boxShadow:
      '0px 67px 80px rgba(0, 0, 0, 0.07), 0px 14.9653px 17.869px rgba(0, 0, 0, 0.0417275), 0px 8.38944px 10.0172px rgba(0, 0, 0, 0.035), 0px 4.45557px 5.32008px rgba(0, 0, 0, 0.0282725), 0px 1.85406px 2.21381px rgba(0, 0, 0, 0.0196802)',
    mt: '2rem',
    overflowY: 'auto',
    maxHeight: '80%',
    borderRadius: '26px',
    paddingTop: '1rem',
    paddingX: '1.5rem',
    '& .MuiMenuItem-root': {
      display: 'flex',
      justifyContent: 'center',
      ':hover': {
        backgroundColor: 'transparent',
      },
    },
    '& .MuiButton-root': {
      ':hover': {
        backgroundColor: 'transparent',
      },
    },
    '& .MuiDivider-root': {
      border: '0.5px orange solid',
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
};

const popupLinkSx = role => ({
  fontSize: '20px',
  fontWeight: '500',
  color: '#222222',
  textTransform: 'none',
  width: '100%',
  borderBottom: `1px solid ${
    role === AUDITOR ? theme.palette.secondary.main : theme.palette.primary.main
  }`,
  ':hover': {
    transition: '0.3s',
    color:
      role === AUDITOR
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    filter: role === AUDITOR ? 'brightness(150%)' : 'none',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '18px',
  },
});

const userInfoSx = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
};

const avatarSx = theme => ({
  width: '80px',
  height: '80px',
  [theme.breakpoints.down('sm')]: {
    width: '70px',
    height: '70px',
  },
});

const mainTextStyle = {
  fontSize: '18px',
  fontWeight: '500',
  color: '#222222',
};

const secondaryTextStyle = theme => ({
  fontSize: '16px !important',
  color: '#222222',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px !important',
  },
});

const tabsSx = {
  display: 'flex',
};

const tabSx = theme => ({
  width: '50%',
  color: '#222222',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'capitalize',
  [theme.breakpoints.down('md')]: {
    minHeight: '41px',
    height: '41px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
  },
});

const auditorTabSx = theme => ({
  backgroundColor: theme.palette.secondary.main,
  color: '#FCFAF6!important',
});

const customerTabSx = theme => ({
  color: '#FCFAF6!important',
  backgroundColor: theme.palette.primary.main,
});

const inactiveTabSx = {
  backgroundColor: '#D9D9D9',
  ':hover': {
    transition: '0.3s',
    backgroundColor: '#C5C5C5',
  },
};
