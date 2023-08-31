import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Typography } from '@mui/material';
import { ASSET_URL } from '../../services/urls.js';
import theme from '../../styles/themes.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';

const Message = ({ message, user, currentChat }) => {
  const { customer } = useSelector(state => state.customer);
  const { auditor } = useSelector(state => state.auditor);

  const userAvatar = useMemo(() => {
    if (user.current_role === AUDITOR && !!auditor?.avatar) {
      return auditor.avatar;
    } else if (user.current_role === CUSTOMER && !!customer?.avatar) {
      return customer.avatar;
    } else {
      return null;
    }
  }, [user.current_role, customer?.avatar, auditor?.avatar]);

  const getMessageAvatar = () => {
    if (message?.from?.id === user?.id) {
      return userAvatar ? `${ASSET_URL}/${userAvatar}` : null;
    }
    return currentChat?.avatar ? `${ASSET_URL}/${currentChat.avatar}` : null;
  };

  return (
    <Box sx={messageSx({ isOwn: message.from?.id === user.id })}>
      <Avatar src={getMessageAvatar()} sx={messageAvatarSx} alt="User photo" />
      <Box sx={messageTextSx({ isOwn: message.from?.id === user.id })}>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>{message.text}</Typography>
        <Box sx={messageTimeSx}>
          {new Date(message?.time / 1000)
            .toLocaleTimeString()
            .replace(/:\d\d(?=$|( AM| PM))/, '')}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;

const messageSx = ({ isOwn }) => ({
  display: 'flex',
  flexDirection: isOwn ? 'row-reverse' : 'row',
});

const messageAvatarSx = theme => ({
  width: '50px',
  height: '50px',
  [theme.breakpoints.down('sm')]: {
    width: '35px',
    height: '35px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '30px',
    height: '30px',
  },
});

const messageTextSx = ({ isOwn }) => ({
  position: 'relative',
  minWidth: '150px',
  maxWidth: '400px',
  margin: '0 20px',
  background: '#e5e5e5',
  borderRadius: isOwn ? '15px 0 15px 15px' : '0 15px 15px 15px',
  '& p': {
    padding: '15px 30px 20px',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '25px',
    color: '#434242',
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '360px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '290px',
    margin: '0 10px',
    '& p': {
      lineHeight: '20px',
      padding: '10px 20px 15px',
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    minWidth: '100px',
    '& p': {
      lineHeight: '18px',
      padding: '5px 10px 15px',
      fontSize: '14px',
    },
  },
});

const messageTimeSx = theme => ({
  position: 'absolute',
  bottom: 2,
  right: 10,
  fontSize: '14px',
  color: '#434242',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
});
