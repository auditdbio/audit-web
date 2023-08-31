import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Avatar, Box, Link, Tooltip } from '@mui/material';
import { ASSET_URL } from '../../services/urls.js';
import { AUDITOR } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
import { addTestsLabel } from '../../lib/helper.js';
import { setCurrentChat } from '../../redux/actions/chatActions.js';

const ChatListItem = ({ user, setListIsOpen, chat }) => {
  const dispatch = useDispatch();

  const setChatHandle = () => {
    setListIsOpen(false);
    dispatch(
      setCurrentChat(chat?.id, { name: chat?.name, avatar: chat?.avatar }),
    );
  };

  const convertDate = date => {
    const messageDate = new Date(date / 1000);
    if (+new Date() - +messageDate > 86_400_000) {
      return messageDate.toLocaleDateString().replace(/\.\d{4}$/, '');
    }
    return messageDate.toLocaleTimeString().replace(/:\d\d(?=$|( AM| PM))/, '');
  };

  return (
    <Link
      sx={wrapper}
      component={RouterLink}
      to={`/chat/${chat?.id}`}
      onClick={setChatHandle}
      {...addTestsLabel('chat-link')}
    >
      <Avatar
        src={chat?.avatar ? `${ASSET_URL}/${chat?.avatar}` : null}
        sx={avatarStyle}
        alt="User photo"
      />

      <Box sx={userInfo}>
        <Tooltip
          title="Mihael Qwerty Asdgdsg"
          arrow
          placement="top"
          enterDelay={500}
          leaveDelay={0}
        >
          <Box sx={userNameSx}>{chat?.name}</Box>
        </Tooltip>
        <Box sx={userStatusSx({ online: true })}>Online</Box>
      </Box>

      <Box sx={messagesInfo}>
        <Box sx={messagesCount({ user, count: 245 })}>245</Box>
        <Box sx={lastMessageTime}>{convertDate(chat.last_message?.time)}</Box>
      </Box>
    </Link>
  );
};

export default ChatListItem;

const wrapper = theme => ({
  direction: 'ltr',
  display: 'flex',
  alignItems: 'center',
  padding: '20px 15px',
  borderBottom: '2px solid #e5e5e5',
  cursor: 'pointer',
  textDecoration: 'none',
  ':hover': { backgroundColor: '#F1F1F1' },
  [theme.breakpoints.down('md')]: {
    padding: '15px 10px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 8px',
  },
});

const avatarStyle = theme => ({
  width: '60px',
  height: '60px',
  mr: '30px',
  [theme.breakpoints.down('md')]: {
    width: '50px',
    height: '50px',
    mr: '15px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '35px',
    height: '35px',
    mr: '10px',
  },
});

const userInfo = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const userNameSx = theme => ({
  display: '-webkit-box',
  fontSize: '24px',
  fontWeight: 600,
  color: 'black',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  [theme.breakpoints.down('md')]: {
    fontSize: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '15px',
  },
});

const userStatusSx = ({ online }) => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#B2B3B3',
  position: 'relative',
  '::before': {
    content: '""',
    display: 'inline-block',
    width: '10px',
    height: '10px',
    background: online ? '#09C010' : 'red',
    borderRadius: '50%',
    mr: '10px',
    [theme.breakpoints.down('sm')]: {
      width: '7px',
      height: '7px',
      mr: '5px',
    },
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '10px',
  },
});

const messagesInfo = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const messagesCount = ({ user, count }) => {
  const getFontSize = () => {
    if (count > 999) return '11px';
    if (count > 99) return '14px';
    return '18px';
  };

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30px',
    height: '30px',
    mb: '5px',
    fontSize: getFontSize(),
    fontWeight: 600,
    color: 'white',
    borderRadius: '50%',
    background:
      user.current_role === AUDITOR
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    [theme.breakpoints.down('md')]: {
      width: '25px',
      height: '25px',
      fontSize: count < 100 ? '15px' : '12px',
    },
    [theme.breakpoints.down('sm')]: {
      width: '20px',
      height: '20px',
      fontSize: count < 100 ? '12px' : '9px',
    },
  };
};

const lastMessageTime = theme => ({
  fontSize: '16px',
  fontWeight: 500,
  color: '#B2B3B3',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
  },
});
