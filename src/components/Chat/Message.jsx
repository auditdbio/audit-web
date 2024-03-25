import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Avatar, Box, Button, Modal, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { ASSET_URL } from '../../services/urls.js';
import theme from '../../styles/themes.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import ImageMessage from './ImageMessage.jsx';
import AuditRequestInfo from '../audit-request-info.jsx';
import AuditMessage from './AuditMessage.jsx';

const Message = ({ message, user, currentChat, isRead, type }) => {
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

  const downloadFile = () => {
    const token = Cookies.get('token');
    axios
      .get(`${ASSET_URL}/${message.text}`, {
        responseType: 'blob',
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          decodeURIComponent(message.text).replace(/^\d*_/, ''),
        );
        document.body.appendChild(link);
        link.click();
      });
  };

  return (
    <Box sx={messageSx({ isOwn: message.from?.id === user.id })}>
      <Avatar src={getMessageAvatar()} sx={messageAvatarSx} alt="User photo" />
      <Box
        sx={
          message.kind === 'Audit'
            ? requestTextSx({ isOwn: message.from?.id === user.id })
            : messageTextSx({ isOwn: message.from?.id === user.id })
        }
      >
        {message.kind === 'Image' ? (
          <ImageMessage message={message} />
        ) : message.kind === 'Audit' ? (
          <AuditMessage message={message} />
        ) : message.kind === 'File' ? (
          <Typography title="Download" sx={linkMessage} onClick={downloadFile}>
            <span>{decodeURIComponent(message.text).replace(/^\d*_/, '')}</span>
          </Typography>
        ) : (
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {makeLinksClickable(message.text)}
          </Typography>
        )}
        <Box sx={messageTimeSx}>
          <Box sx={{ mr: '5px' }}>
            {new Date(message?.time / 1000)
              .toLocaleTimeString()
              .replace(/:\d\d(?=$|( AM| PM))/, '')}
          </Box>
          {isRead && user.id === message.from?.id && (
            <DoneAllIcon fontSize="small" />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;

function makeLinksClickable(text) {
  const urlRegex = /((?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, idx) => {
    if (urlRegex.test(part)) {
      return (
        <a key={idx} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
}

const messageSx = ({ isOwn }) => ({
  display: 'flex',
  flexDirection: isOwn ? 'row-reverse' : 'row',
});

const contentSx = theme => ({
  borderRadius: '10px',
  padding: '15px 30px 25px',
  '& p': {
    padding: 'unset',
  },
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
    padding: '15px 30px 25px',
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
      padding: '10px 20px 18px',
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    minWidth: '100px',
    '& p': {
      lineHeight: '18px',
      padding: '5px 10px 18px',
      fontSize: '14px',
    },
  },
});

const requestTextSx = ({ isOwn }) => ({
  position: 'relative',
  minWidth: '150px',
  maxWidth: '400px',
  width: '100%',
  margin: '0 20px',
  background: '#e5e5e5',
  padding: '15px',
  paddingBottom: '30px',
  borderRadius: isOwn ? '15px 0 15px 15px' : '0 15px 15px 15px',
  '& p': {
    // padding: '15px',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '25px',
    color: '#434242',
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  '& button': {
    paddingX: '5px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '360px',
    '& .chat-request': {
      paddingX: '10px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '290px',
    margin: '0 10px',
    '& p': {
      lineHeight: '20px',
      // padding: '10px 20px 18px',
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    minWidth: '100px',
    '& p': {
      lineHeight: '18px',
      padding: '5px 10px 18px',
      fontSize: '14px',
    },
  },
});

const linkMessage = {
  whiteSpace: 'pre-wrap',
  '& span': {
    cursor: 'pointer',
    textDecoration: 'none',
    color: '#152BEA !important',
  },
};

const messageTimeSx = theme => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  bottom: 2,
  right: 10,
  fontSize: '14px',
  color: '#434242',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
});
