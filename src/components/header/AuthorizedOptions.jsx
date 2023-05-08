import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, useMediaQuery, Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import theme from '../../styles/themes.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import { ASSET_URL } from '../../services/urls.js';
import CustomMenu from '../custom/CustomMenu.jsx';
import CustomBadge from '../customBudge';
import { UserMenu } from './UserMenu.jsx';
import RoleMenuDropdown from './RoleMenuDropdown.jsx';
import { authorizedPages } from './constants.js';

const AuthorizedOptions = () => {
  const matchSm = useMediaQuery(theme.breakpoints.down('sm'));

  const reduxUser = useSelector(state => state.user.user);
  const auditor = useSelector(state => state.auditor.auditor);
  const customer = useSelector(state => state.customer.customer);

  const [currentUsername] = useState(reduxUser.name || 'User');
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [anchorElRole, setAnchorElRole] = useState(null);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleCloseUserMenu = () => {
    setIsUserMenuOpen(false);
    setAnchorElUser(null);
  };

  const handleCloseRoleMenu = () => {
    setIsRoleMenuOpen(false);
    setAnchorElRole(null);
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
          <CustomBadge />
          <Avatar
            src={userAvatar ? `${ASSET_URL}/${userAvatar}` : ''}
            style={{ width: '35px', height: '35px' }}
          />
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
          <CustomBadge />
          <Typography sx={userGreeting}>Hello, {currentUsername}!</Typography>
          <IconButton
            onClick={handleOpenUserMenu}
            sx={{ ml: 1 }}
            aria-controls={anchorElUser ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={anchorElUser ? 'true' : undefined}
            disableRipple
          >
            <Avatar
              src={userAvatar ? `${ASSET_URL}/${userAvatar}` : ''}
              sx={avatarStyle}
            />
            <UserMenu
              open={isUserMenuOpen}
              userAvatar={userAvatar}
              handleClose={handleCloseUserMenu}
              anchor={anchorElUser}
            />
          </IconButton>
          <RoleMenuDropdown
            open={isRoleMenuOpen}
            handleClose={handleCloseRoleMenu}
            anchor={anchorElRole}
          />
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
};

const desktopWrapper = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
};

const userGreeting = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '26px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
};

const avatarStyle = theme => ({
  width: '100px',
  height: '100px',
  [theme.breakpoints.down('lg')]: {
    width: '60px',
    height: '60px',
  },
});

export default AuthorizedOptions;
