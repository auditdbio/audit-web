import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { ASSET_URL } from '../../services/urls.js';
import theme from '../../styles/themes.js';

const Message = ({ message, companionUser, user }) => {
  return (
    <Box sx={messageSx(true)}>
      <Avatar
        src={
          companionUser?.avatar ? `${ASSET_URL}/${companionUser?.avatar}` : null
        }
        sx={messageAvatarSx}
        alt="User photo"
      />
      <Box sx={messageTextSx(true)}>
        <Typography>
          Hello. My name is Michael. Im your auditor and i have some questions
          for you.
        </Typography>
        <Box sx={messageTimeSx}>19:45</Box>
      </Box>
    </Box>
  );
};

export default Message;

const messageSx = isOwn => ({
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

const messageTextSx = isOwn => ({
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
