import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Avatar, Box, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { ASSET_URL } from '../../services/urls.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import ImageMessage from './ImageMessage.jsx';
import AuditMessage from './AuditMessage.jsx';
import theme from '../../styles/themes.js';

const Message = ({ message, user, currentChat, isRead, previousMessage }) => {
  const { customer } = useSelector(state => state.customer);
  const { auditor } = useSelector(state => state.auditor);

  let fileMessage;
  if (message?.kind === 'File') {
    try {
      fileMessage = JSON.parse(message.text);
    } catch (e) {
      fileMessage = {};
    }
  } else {
    fileMessage = {};
  }

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
      return userAvatar ? `${ASSET_URL}/id/${userAvatar}` : null;
    }
    return currentChat?.avatar ? `${ASSET_URL}/id/${currentChat.avatar}` : null;
  };

  const downloadFile = () => {
    const token = Cookies.get('token');
    axios
      .get(`${ASSET_URL}/id/${fileMessage?.file_id}`, {
        responseType: 'blob',
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileMessage?.filename);
        document.body.appendChild(link);
        link.click();
      });
  };

  const shouldShowAvatar =
    !previousMessage || previousMessage.from?.id !== message.from?.id;

  return (
    <Box sx={[messageSx({ isOwn: message.from?.id === user.id })]}>
      {shouldShowAvatar ? (
        <Box
          sx={{
            width: '60px',
            display: 'flex',
            justifyContent: 'center',
            [theme.breakpoints.down('xs')]: {
              width: '50px',
            },
          }}
        >
          <Avatar
            src={getMessageAvatar()}
            sx={messageAvatarSx}
            alt="User photo"
          />
        </Box>
      ) : (
        <Box className={'avatar-plug'} sx={avatarPlugSx}>
          <Box
            sx={{
              fontSize: '13px',
              color: '#434242',
              width: '60px',
              display: 'flex',
              justifyContent: 'center',
              [theme.breakpoints.down('sm')]: {
                fontSize: '12px',
              },
              [theme.breakpoints.down('xs')]: {
                fontSize: '10px',
                width: '50px',
              },
            }}
          >
            {new Date(message?.time / 1000)
              .toLocaleTimeString()
              .replace(/:\d\d(?=$|( AM| PM))/, '')}
          </Box>
        </Box>
      )}
      <Box
        sx={[
          message.kind === 'Audit'
            ? requestTextSx(
                { isOwn: message.from?.id === user.id },
                !shouldShowAvatar,
              )
            : messageTextSx(
                { isOwn: message.from?.id === user.id },
                !shouldShowAvatar,
              ),
          shouldShowAvatar
            ? {
                '& p': {
                  paddingBottom: '20px',
                },
              }
            : {},
        ]}
      >
        {message.kind === 'Image' ? (
          <ImageMessage message={message} />
        ) : message.kind === 'Audit' ? (
          <AuditMessage message={message} />
        ) : message.kind === 'File' ? (
          <Typography title="Download" sx={linkMessage} onClick={downloadFile}>
            <span>{fileMessage?.filename}</span>
          </Typography>
        ) : (
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {makeLinksClickable(message.text)}
          </Typography>
        )}
        <Box
          sx={messageTimeSx(
            theme,
            shouldShowAvatar,
            message.from?.id === user.id,
          )}
          className={'messageTimeSx'}
        >
          {shouldShowAvatar && (
            <Box sx={{ mr: '5px', paddingBottom: '2px' }}>
              {new Date(message?.time / 1000)
                .toLocaleTimeString()
                .replace(/:\d\d(?=$|( AM| PM))/, '')}
            </Box>
          )}
          {isRead && user.id === message.from?.id && (
            <DoneAllIcon
              sx={{ width: '18px', height: '18px' }}
              fontSize="small"
            />
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
  '&:hover .avatar-plug': {
    opacity: 1,
  },
});

const contentSx = theme => ({
  borderRadius: '10px',
  padding: '15px 30px 25px',
  '& p': {
    padding: 'unset',
  },
});

const avatarPlugSx = theme => ({
  width: '60px',
  opacity: '0',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  [theme.breakpoints.down('xs')]: {
    width: '50px',
  },
});

const messageAvatarSx = theme => ({
  width: '50px',
  height: '50px',
  [theme.breakpoints.down('xs')]: {
    width: '40px',
    height: '40px',
  },
});

const messageTextSx = ({ isOwn, single }) => ({
  position: 'relative',
  minWidth: '50px',
  maxWidth: '700px',
  margin: '0 5px',
  background: '#e5e5e5',
  borderRadius: isOwn ? '15px 0 15px 15px' : '0 15px 15px 15px',
  '& p': {
    padding: single || isOwn ? '5px 20px 10px' : '5px 20px 10px',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '22px',
    color: '#434242',
    overflow: 'hidden',
    wordBreak: 'break-word',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '560px',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '490px',
    '& p': {
      lineHeight: '17px',
      fontSize: '16px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    minWidth: '100px',
    '& p': {
      lineHeight: '16px',
      padding: '5px 10px 18px',
      fontSize: '14px',
    },
  },
});

const requestTextSx = ({ isOwn }) => ({
  position: 'relative',
  minWidth: '50px',
  maxWidth: '400px',
  width: '100%',
  margin: '0 5px',
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

const messageTimeSx = (theme, single, isOwn) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  bottom: '0px',
  right: 4,
  ...(isOwn
    ? {}
    : {
        left: '8px!important',
      }),
  fontSize: '14px',
  color: '#434242',
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
});
