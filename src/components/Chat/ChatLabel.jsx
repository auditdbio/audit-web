import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import theme from '../../styles/themes.js';
import ChatIcon from '../icons/ChatIcon.jsx';
import { CustomBadge } from '../custom/Badge.jsx';
import { getTotalUnreadMessages } from '../../redux/actions/chatActions.js';
import { AUDITOR } from '../../redux/actions/types.js';

const ChatLabel = () => {
  const dispatch = useDispatch();
  const { chatList, unreadMessages } = useSelector(s => s.chat);
  const { user } = useSelector(s => s.user);

  useEffect(() => {
    dispatch(getTotalUnreadMessages());
  }, [chatList]);

  return (
    <Box sx={wrapper}>
      <Link to="/chat">
        <CustomBadge
          badgeContent={unreadMessages}
          color={user.current_role === AUDITOR ? 'secondary' : 'primary'}
        >
          <Box sx={iconWrapper}>
            <ChatIcon />
          </Box>
        </CustomBadge>
      </Link>
    </Box>
  );
};

export default ChatLabel;

const wrapper = {
  position: 'relative',
  '& .MuiBadge-badge': {
    top: '5px',
  },
};

const iconWrapper = theme => ({
  width: '35px',
  height: '35px',
  background: '#e5e5e5',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: '0.3s',
  '& svg': {
    width: '30px',
    [theme.breakpoints.down('xs')]: {
      width: 'unset',
    },
  },
  ':hover': { background: '#d1d1d1' },
});

const notice = count => ({
  position: 'absolute',
  top: 0,
  right: '-8px',
  width: '25px',
  height: '25px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#FF0000',
  borderRadius: '50%',
  fontSize: count < 100 ? '18px' : '12px',
  fontWeight: 600,
  color: 'white',
  pointerEvents: 'none',
  [theme.breakpoints.down('xs')]: {
    border: '1px solid white',
    fontSize: count < 100 ? '12px' : '10px',
  },
});
