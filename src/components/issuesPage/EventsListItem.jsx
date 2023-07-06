import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Typography } from '@mui/material';
import EventIcon from './EventIcon.jsx';
import IssueSeverity from './IssueSeverity.jsx';
import { addSpacesToCamelCase } from '../../lib/helper.js';
import CommentIcon from '../icons/issueEvents/CommentIcon.jsx';
import Markdown from '../markdown/Markdown.jsx';
import { ASSET_URL } from '../../services/urls.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';

const EventsListItem = ({ event, idx, issue, issueRefs, auditPartner }) => {
  const issueRef = useRef(null);
  issueRefs.current[idx] = issueRef;

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

  return event.kind !== 'Comment' ? (
    <Box
      sx={[eventSx, issue.read - 1 <= idx && unreadChanges(false)]}
      ref={issueRef}
    >
      <Box sx={iconSx}>
        <EventIcon kind={event.kind} />
      </Box>
      <Avatar sx={avatarSx} alt="user photo" src={getAvatarURL(event)} />

      {event.kind === 'IssueSeverity' ? (
        <Box sx={issueSeverityWrapper}>
          <Typography sx={[eventTextSx, { mr: '5px' }]}>
            <b>{event.user === user?.id ? 'You' : auditPartner?.first_name}</b>
            &nbsp;changed severity to &nbsp;
          </Typography>
          <IssueSeverity text={event.message} />
        </Box>
      ) : (
        <Typography sx={eventTextSx}>
          <b>{event.user === user?.id ? 'You' : auditPartner?.first_name}</b>
          &nbsp;{addSpacesToCamelCase(event.message)}
        </Typography>
      )}

      <Typography variant="span" sx={messageDate}>
        ({new Date(event.timestamp * 1000).toDateString().replace(/^\w* /, '')})
      </Typography>
    </Box>
  ) : (
    <Box
      key={event.id}
      sx={[messageWrapper, issue.read - 1 <= idx && unreadChanges(true)]}
      ref={issueRef}
    >
      <Box sx={messageHeader}>
        <Box sx={messageUserInfo}>
          <Box sx={[iconSx, commentIconSx]}>
            <CommentIcon />
          </Box>
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
};

export default EventsListItem;

const eventSx = {
  display: 'flex',
  alignItems: 'center',
  mb: '20px',
  ':last-child': {
    mb: 0,
  },
};

const iconSx = theme => ({
  width: '35px',
  height: '35px',
  display: 'flex',
  flexShrink: 0,
  justifyContent: 'center',
  alignItems: 'center',
  background: '#D9D9D9',
  borderRadius: '50%',
  mr: '20px',
  position: 'relative',
  [theme.breakpoints.down('xs')]: {
    mr: '10px',
  },
});

const commentIconSx = theme => ({
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
});

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
    letterSpacing: '-1.2px',
  },
});

const issueSeverityWrapper = theme => ({
  mr: '20px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    '& .MuiChip-root': {
      height: '18px',
      '& span': {
        padding: '0 6px',
        fontSize: '12px',
        letterSpacing: '-1px',
      },
    },
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
    padding: '5px 10px',
  },
});

const messageUserInfo = {
  display: 'flex',
  alignItems: 'center',
};

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

const messageTextSx = {
  background: 'white',
  border: '2px solid #E5E5E5',
  borderTop: 'none',
};

const unreadChanges = isComment => ({
  position: 'relative',
  '&::before': {
    display: 'block',
    content: "''",
    position: 'absolute',
    top: isComment ? '27px' : '50%',
    left: '-20px',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    backgroundColor: '#5b97bb',
    borderRadius: '50%',
    [theme.breakpoints.down('xs')]: {
      left: '-10px',
      width: '5px',
      height: '5px',
    },
  },
});
