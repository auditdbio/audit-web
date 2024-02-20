import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Typography,
  useMediaQuery,
  Avatar,
  Badge,
  Tooltip,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../../styles/themes.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import { ASSET_URL } from '../../services/urls.js';
import CustomMenu from '../custom/CustomMenu.jsx';
import CustomBadge from '../customBudge';
import { UserMenu } from './UserMenu.jsx';
import { authorizedPages } from './constants.js';
import { addTestsLabel, isAuth } from '../../lib/helper.js';
import ChatLabel from '../Chat/ChatLabel.jsx';

const AuthorizedOptions = () => {
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));

  const reduxUser = useSelector(state => state.user.user);
  const auditor = useSelector(state => state.auditor.auditor);
  const customer = useSelector(state => state.customer.customer);
  const { differentRoleUnreadMessages } = useSelector(s => s.chat);

  const [currentUsername] = useState(reduxUser.name || 'User');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
    setAnchorElUser(null);
  };

  const userAvatar = useMemo(() => {
    if (reduxUser.current_role === AUDITOR && !!auditor?.avatar) {
      return auditor.avatar;
    } else if (reduxUser.current_role === CUSTOMER && !!customer?.avatar) {
      return customer.avatar;
    } else {
      return null;
    }
  }, [reduxUser.current_role, customer?.avatar, auditor?.avatar]);

  return (
    <>
      {/*   Mobile Screen  */}
      {matchSm && (
        <Box sx={mobileWrapper}>
          {isAuth() && <ChatLabel />}
          <CustomBadge />
          <Avatar
            src={userAvatar ? `${ASSET_URL}/${userAvatar}` : ''}
            sx={mobileAvatarSx}
            alt="User photo"
          />
          <Badge
            variant="dot"
            component="span"
            color={reduxUser.current_role === AUDITOR ? 'primary' : 'secondary'}
          >
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
              sx={{ padding: 0 }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
          </Badge>

          <UserMenu
            pages={authorizedPages}
            userAvatar={userAvatar}
            open={isUserMenuOpen}
            handleClose={handleCloseUserMenu}
            anchor={anchorElUser}
          />
        </Box>
      )}

      {/*  Desktop Screen  */}
      {!matchSm && (
        <Box sx={desktopWrapper}>
          {authorizedPages.map(page => (
            <CustomMenu
              key={page.id}
              options={page.menuOptions}
              buttonText={page.name}
            />
          ))}
          <ChatLabel />
          <CustomBadge />
          <Typography sx={userGreeting}>Hello, {currentUsername}!</Typography>
          <IconButton
            onClick={handleOpenUserMenu}
            aria-controls={anchorElUser ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorElUser ? 'true' : undefined}
            aria-label="User menu"
            disableRipple
            {...addTestsLabel('header_usermenu-button')}
          >
            <Tooltip
              title={
                differentRoleUnreadMessages > 0
                  ? 'You have unread notifications for a different role profile'
                  : ''
              }
              arrow
              placement="top"
              enterDelay={500}
              leaveDelay={0}
            >
              <Badge
                variant="dot"
                component="span"
                invisible={differentRoleUnreadMessages <= 0}
                color={
                  reduxUser.current_role === AUDITOR ? 'primary' : 'secondary'
                }
              >
                <Avatar
                  src={userAvatar ? `${ASSET_URL}/${userAvatar}` : ''}
                  sx={avatarStyle(reduxUser.current_role)}
                  alt="User photo"
                />
              </Badge>
            </Tooltip>
            <UserMenu
              open={isUserMenuOpen}
              userAvatar={userAvatar}
              handleClose={handleCloseUserMenu}
              anchor={anchorElUser}
            />
          </IconButton>
        </Box>
      )}
    </>
  );
};

const mobileWrapper = {
  flexGrow: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  '& .MuiBadge-dot': {
    top: '8px',
    right: '3px',
    borderRadius: '50%',
    height: '11px',
    width: '11px',
  },
};

const desktopWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  '& .MuiBadge-dot': {
    top: '6px',
    right: '8px',
    borderRadius: '50%',
    height: '14px',
    width: '14px',
  },
};

const userGreeting = theme => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '26px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down(1200)]: {
    display: 'none',
  },
});

const avatarStyle = role => ({
  width: '60px',
  height: '60px',
  transition: 'filter 0.3s',
  '&:hover': {
    filter: 'brightness(85%)',
  },
  border: `3px solid ${
    role === AUDITOR ? theme.palette.secondary.main : theme.palette.primary.main
  }`,
});

const mobileAvatarSx = theme => ({
  width: '35px',
  height: '35px',
  [theme.breakpoints.down('xxs')]: {
    display: 'none',
  },
});

export default AuthorizedOptions;
