import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom/dist';
import { Box } from '@mui/material';
import ChatIcon from '../icons/ChatIcon.jsx';
import { CustomBadge } from '../custom/Badge.jsx';
import {
  chatSetError,
  getTotalUnreadMessages,
} from '../../redux/actions/chatActions.js';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import CustomSnackbar from '../custom/CustomSnackbar.jsx';

const ChatLabel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chatList, unreadMessages, error } = useSelector(s => s.chat);
  const { user } = useSelector(s => s.user);
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);

  useEffect(() => {
    dispatch(getTotalUnreadMessages(chatList));
  }, [chatList]);

  const handleClick = e => {
    e.preventDefault();
    if (
      (user.current_role === AUDITOR &&
        auditor?.user_id &&
        auditor?.first_name) ||
      (user.current_role === CUSTOMER &&
        customer?.user_id &&
        customer?.first_name)
    ) {
      localStorage.setItem('path', window.location.pathname);
      navigate('/chat');
    } else {
      const role = user.current_role?.[0];
      navigate(`/${role}/${user.id}`);
      dispatch(chatSetError('Fill your profile'));
    }
  };

  return (
    <Box sx={wrapper}>
      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error}
        onClose={() => dispatch(chatSetError(null))}
        severity="warning"
        text={error}
      />

      <Link to="/chat" onClick={handleClick}>
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
