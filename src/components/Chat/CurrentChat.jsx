import React, { useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu.js';
import { ASSET_URL } from '../../services/urls.js';
import AttachIcon from '../icons/AttachIcon.jsx';
import SendMessageIcon from '../icons/SendMessageIcon.jsx';
import { AUDITOR } from '../../redux/actions/types.js';
import { addTestsLabel } from '../../lib/helper.js';
import theme from '../../styles/themes.js';
import Message from './Message.jsx';

const CurrentChat = ({ companionUser, setChatListIsOpen }) => {
  const { id } = useParams();
  const { user } = useSelector(s => s.user);
  const [newMessage, setNewMessage] = useState('');

  const handleMessageInput = e => {
    setNewMessage(e.target.value);
  };

  const handleSend = () => {
    return;
  };

  return (
    <Box sx={wrapper}>
      <Box sx={currentChatHeader}>
        <IconButton
          aria-label="Chat list"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={() => setChatListIsOpen(prev => !prev)}
          color="inherit"
          sx={menuButtonSx}
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        <RouterLink to={`/user/:id/:role`}>
          <Avatar
            src={
              companionUser?.avatar
                ? `${ASSET_URL}/${companionUser?.avatar}`
                : null
            }
            sx={avatarStyle}
            alt="User photo"
          />
        </RouterLink>
        <Box sx={userInfo}>
          <Link
            component={RouterLink}
            to={`/user/:id/:role`}
            sx={userNameSx}
            {...addTestsLabel('profile-link')}
          >
            Mihael
          </Link>
          <Box sx={userStatusSx(true)}>Online</Box>
        </Box>

        <IconButton
          color="disabled"
          aria-label="Attach file"
          onClick={() => {}}
          sx={attachButton}
        >
          <AttachIcon />
        </IconButton>
      </Box>

      <Box sx={chatSx}>
        <Message companionUser={companionUser} user={user} />
        <Message companionUser={companionUser} user={user} />
        <Message companionUser={companionUser} user={user} />
        <Message companionUser={companionUser} user={user} />
        <Message companionUser={companionUser} user={user} />
      </Box>

      <Box sx={sendBox}>
        <TextField
          onChange={handleMessageInput}
          value={newMessage}
          placeholder="Type here..."
          variant="standard"
          fullWidth
          sx={newMessageSx}
          InputProps={{ disableUnderline: true }}
          inputProps={{
            style: newMessageInput,
            ...addTestsLabel('message-input'),
          }}
        />
        <Button
          color={user.current_role === AUDITOR ? 'secondary' : 'primary'}
          variant="contained"
          sx={sendButton}
          onClick={handleSend}
          {...addTestsLabel('send-button')}
        >
          <SendMessageIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default CurrentChat;

const wrapper = theme => ({
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const currentChatHeader = theme => ({
  display: 'flex',
  alignItems: 'center',
  height: '85px',
  borderBottom: '2px solid #e5e5e5',
  padding: '12px 20px',
  [theme.breakpoints.down('sm')]: {
    height: '75px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '12px 8px',
  },
});

const menuButtonSx = theme => ({
  display: 'none',
  mr: '10px',
  [theme.breakpoints.down('xs')]: {
    display: 'inline-flex',
  },
});

const avatarStyle = theme => ({
  width: '60px',
  height: '60px',
  mr: '30px',
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    height: '50px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '40px',
    height: '40px',
    mr: '15px',
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
  alignSelf: 'flex-start',
  fontSize: '26px',
  fontWeight: 600,
  textDecoration: 'none',
  color: 'black',
  overflow: 'hidden',
  wordBreak: 'break-word',
  '-webkit-line-clamp': '2',
  '-webkit-box-orient': 'vertical',
  'text-overflow': 'ellipsis',
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
    mb: '5px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '16px',
    mb: '3px',
  },
});

const userStatusSx = online => ({
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
    [theme.breakpoints.down('xs')]: {
      width: '7px',
      height: '7px',
      mr: '7px',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '12px',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '9px',
  },
});

const attachButton = theme => ({
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '35px',
    height: '35px',
  },
});

const chatSx = theme => ({
  position: 'relative',
  padding: '40px',
  maxHeight: '640px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  rowGap: '30px',
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    width: '6px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '20px',
    rowGap: '20px',
    maxHeight: '650px',
    '::-webkit-scrollbar': {
      width: '4px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    padding: '20px 10px',
    rowGap: '15px',
    maxHeight: '75vh',
  },
});

const sendBox = {
  display: 'flex',
  height: '55px',
};

const newMessageSx = {
  borderTop: '2px solid #e5e5e5',
};

const newMessageInput = {
  height: '53px',
  fontSize: '18px',
  fontWeight: 500,
  padding: '0 40px',
  borderBottom: 'none',
};

const sendButton = theme => ({
  padding: '10px 50px',
  borderRadius: 0,
  [theme.breakpoints.down('sm')]: {
    padding: '10px 30px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '10px 20px',
  },
});
