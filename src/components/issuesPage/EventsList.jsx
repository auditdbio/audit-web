import React, { useMemo } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import EventIcon from './EventIcon.jsx';
import Markdown from '../custom/Markdown.jsx';
import { ASSET_URL } from '../../services/urls.js';
import { useSelector } from 'react-redux';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';

const EventsList = ({ issue, auditPartner }) => {
  const { user } = useSelector(s => s.user);
  const { auditor } = useSelector(state => state.auditor);
  const { customer } = useSelector(state => state.customer);

  const userAvatar = useMemo(() => {
    if (user.current_role === AUDITOR && !!auditor?.avatar) {
      return auditor.avatar;
    } else if (user.current_role === CUSTOMER && !!customer?.avatar) {
      return customer.avatar;
    } else {
      return null;
    }
  }, [user.current_role, customer?.avatar, auditor?.avatar]);

  const getAvatarURL = event => {
    if (user?.id === event.user) {
      return userAvatar ? `${ASSET_URL}/${userAvatar}` : '';
    } else {
      return auditPartner?.avatar ? `${ASSET_URL}/${auditPartner?.avatar}` : '';
    }
  };

  return (
    <Box sx={wrapper}>
      {issue.events.map(event => {
        return event.kind !== 'Comment' ? (
          <Box key={event.id} sx={eventSx}>
            <Box sx={iconSx}>
              <EventIcon kind={event.kind} />
            </Box>
            <Avatar sx={avatarSx} alt="user photo" src={getAvatarURL(event)} />
            <Typography sx={[eventTextSx, { mr: '5px', fontWeight: 700 }]}>
              {event.user === user?.id ? 'You' : auditPartner?.first_name}
            </Typography>
            <Typography sx={eventTextSx}>{event.message}</Typography>
            <Typography variant="span" sx={messageDate}>
              (
              {new Date(event.timestamp * 1000)
                .toDateString()
                .replace(/^\w* /, '')}
              )
            </Typography>
          </Box>
        ) : (
          <Box key={event.id} sx={messageWrapper}>
            <Box sx={messageHeader}>
              <Box sx={messageUserInfo}>
                <MessageIcon color="default" sx={messageIconSx} />
                <Typography
                  sx={[messageHeaderText, { mr: '5px', fontWeight: 700 }]}
                  variant="span"
                >
                  {event.user === user?.id ? 'You' : auditPartner?.first_name}
                </Typography>
                <Typography sx={messageHeaderText} variant="span">
                  commented
                </Typography>
              </Box>
              <Typography sx={messageDate} variant="span">
                {new Date(event.timestamp * 1000).toLocaleString()}
              </Typography>
            </Box>
            <Box sx={messageTextSx}>
              <Markdown value={event.message} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default EventsList;

const wrapper = theme => ({
  position: 'relative',
  width: '100%',
  overflowX: 'auto',
  padding: '20px 20px 0',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xs')]: {
    padding: 0,
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '36px',
    width: '2px',
    backgroundColor: '#b9b9b9',
    [theme.breakpoints.down('xs')]: {
      left: '16px',
    },
  },
});

const eventSx = {
  display: 'flex',
  alignItems: 'center',
  mb: '20px',
  ':last-child': {
    mb: 0,
  },
};

const iconSx = {
  display: 'flex',
  mr: '20px',
  position: 'relative',
};

const avatarSx = theme => ({
  width: '30px',
  height: '30px',
  mr: '13px',
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
});

const eventTextSx = theme => ({
  color: '#434242',
  fontWeight: 500,
  fontSize: '20px',
  lineHeight: '24px',
  mr: '20px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    letterSpacing: '-1px',
    maxWidth: '125px',
  },
});

const messageWrapper = {
  position: 'relative',
  zIndex: 1,
  mb: '20px',
  ':last-child': {
    mb: 0,
  },
};

const messageHeader = theme => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#F5F5F5',
  border: '2px solid #E5E5E5',
  padding: '9px 23px',
  [theme.breakpoints.down('xs')]: {
    padding: '9px 10px',
  },
});

const messageUserInfo = theme => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    maxWidth: '145px',
  },
});

const messageHeaderText = theme => ({
  fontSize: '16px',
  wordBreak: 'break-word',
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
    letterSpacing: '-1px',
  },
});

const messageDate = theme => ({
  fontSize: '12px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '9px',
    letterSpacing: '-0.5px',
  },
});

const messageIconSx = theme => ({
  mr: '20px',
  pt: '3px',
  [theme.breakpoints.down('xs')]: {
    mr: '10px',
  },
});

const messageTextSx = {
  background: 'white',
  border: '2px solid #E5E5E5',
  borderTop: 'none',
};
