import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Avatar, Box, Link, Tooltip } from '@mui/material';
import { ASSET_URL } from '../../services/urls.js';
import { AUDITOR } from '../../redux/actions/types.js';
import theme from '../../styles/themes.js';
import { addTestsLabel } from '../../lib/helper.js';
import { setCurrentChat } from '../../redux/actions/chatActions.js';

const ChatListItem = ({
  user,
  setListIsOpen,
  setSearch,
  chat,
  isNew = false,
  userDataId = false,
  role,
}) => {
  const dispatch = useDispatch();

  const getUnreadForUser = chat =>
    chat.unread.find(unread => unread.id === user.id)?.unread || 0;

  const getRole = () =>
    role || chat.members.find(member => member.id !== user.id)?.role;

  const setChatHandle = () => {
    setListIsOpen(false);
    setSearch('');
    const members = chat?.members.map(member => member.id);

    dispatch(
      setCurrentChat(chat?.id, {
        name: chat?.name,
        avatar: chat?.avatar,
        members,
        isNew,
        userDataId,
        role: getRole(),
      }),
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
      <Box sx={avatarBorder(getRole())}>
        <Avatar
          src={chat?.avatar ? `${ASSET_URL}/${chat?.avatar}` : null}
          alt="User photo"
          sx={avatarStyle}
        />
      </Box>

      <Box sx={chatDataWrapper}>
        <Box sx={chatData}>
          <Tooltip
            title={`${chat?.name}`}
            arrow
            placement="top"
            enterDelay={500}
            leaveDelay={0}
          >
            <Box sx={userNameSx}>{chat?.name}</Box>
          </Tooltip>
          {!isNew && (
            <Box sx={lastMessageTime}>
              {convertDate(chat.last_message?.time)}
            </Box>
          )}
        </Box>

        <Box sx={chatData}>
          <Box sx={roleSx(getRole())}>{getRole()}</Box>
          {!isNew && chat.unread && !!getUnreadForUser(chat) && (
            <Box sx={messagesCount({ user, count: getUnreadForUser(chat) })}>
              {getUnreadForUser(chat)}
            </Box>
          )}
        </Box>
        {/*<Box sx={userStatusSx({ online: true })}>Online</Box>*/}
      </Box>
    </Link>
  );
};

export default ChatListItem;

const wrapper = theme => ({
  direction: 'ltr',
  display: 'flex',
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

const chatDataWrapper = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'flex-start',
  flexGrow: 1,
  height: '90px',
  [theme.breakpoints.down('md')]: {
    height: '75px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '58px',
  },
});

const chatData = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const avatarBorder = role => ({
  flexShrink: 0,
  padding: '2px',
  mr: '30px',
  width: '68px',
  height: '68px',
  borderRadius: '50%',
  border: `4px solid ${
    role?.toLowerCase() === AUDITOR
      ? theme.palette.secondary.main
      : theme.palette.primary.main
  }`,
  [theme.breakpoints.down('md')]: {
    width: '56px',
    height: '56px',
    mr: '15px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
    mr: '10px',
    borderWidth: '2px',
  },
});

const avatarStyle = {
  width: '100%',
  height: '100%',
};

const userNameSx = theme => ({
  pr: '5px',
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

const roleSx = role => ({
  display: 'flex',
  alignItems: 'center',
  height: '30px',
  color:
    role?.toLowerCase() === AUDITOR
      ? theme.palette.secondary.main
      : theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '13px',
  textTransform: 'capitalize',
  [theme.breakpoints.down('md')]: {
    height: '25px',
  },
  [theme.breakpoints.down('sm')]: {
    height: '20px',
    fontSize: '10px',
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
  alignSelf: 'baseline',
  pt: '5px',
  fontSize: '16px',
  fontWeight: 500,
  color: '#B2B3B3',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '11px',
    pt: '4px',
  },
});
