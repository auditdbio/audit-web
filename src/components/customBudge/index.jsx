import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, ClickAwayListener, Typography } from '@mui/material';
import { CustomBadge } from '../custom/Badge.jsx';
import NotificationsIcon from '@mui/icons-material/Notifications.js';
import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { AUDITOR } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
import { addTestsLabel } from '../../lib/helper.js';
import {
  websocketConnect,
  websocketDisconnect,
} from '../../redux/actions/websocketAction.js';
import CustomMessage from '../custom/customMessage.jsx';

const CustomBudge = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const currentRole = useSelector(s => s.user.user.current_role);
  const messages = useSelector(s => s.websocket.messages);

  useEffect(() => {
    dispatch(websocketConnect());
    return () => dispatch(websocketDisconnect());
  }, [websocketConnect]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: 'relative' }}>
        <Button
          disableRipple
          aria-label="message"
          sx={iconButtonStyle}
          onClick={() => setIsOpen(!isOpen)}
          {...addTestsLabel(`header_notification-button`)}
        >
          <CustomBadge
            badgeContent={messages.length}
            color={currentRole === AUDITOR ? 'secondary' : 'primary'}
            sx={{ color: 'black' }}
          >
            <NotificationsIcon />
          </CustomBadge>
        </Button>
        {isOpen && (
          <Box sx={modalWrapper(currentRole, theme)}>
            {messages.length ? (
              messages.map(message => (
                <CustomMessage key={message.id} message={message} />
              ))
            ) : (
              <Typography sx={titleStyle}>Nothing new to report</Typography>
            )}
          </Box>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default CustomBudge;

const iconButtonStyle = {
  width: '35px',
  minWidth: 'unset',
  height: '35px',
  backgroundColor: '#D9D9D9',
  borderRadius: '50px',
  marginY: 'auto',
  textTransform: 'none',
  position: 'relative',
  ':hover': {
    transition: '0.3s',
    backgroundColor: '#B9B9B9',
  },
};

const titleStyle = {
  color: '#000',
  fontSize: '16px!important',
  padding: '5px',
};

const modalWrapper = (role, theme) => ({
  position: 'absolute',
  top: '44px',
  width: '220px',
  left: 0,
  backgroundColor: '#fff',
  borderRadius: '5px',
  maxHeight: '250px',
  overflowY: 'auto',
  zIndex: 9,
  border: '1px solid',
  borderColor:
    role === AUDITOR
      ? theme.palette.secondary?.main
      : theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    left: 'auto',
    right: 'calc(50% - 110px)',
  },
});
