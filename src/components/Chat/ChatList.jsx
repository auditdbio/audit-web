import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined.js';
import CloseIcon from '@mui/icons-material/Close';
import { addTestsLabel } from '../../lib/helper.js';
import ChatListItem from './ChatListItem.jsx';
import { AUDITOR } from '../../redux/actions/types.js';

const ChatList = ({ chatListIsOpen, setChatListIsOpen }) => {
  const [search, setSearch] = useState('');
  const { user } = useSelector(s => s.user);

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  return (
    <Box sx={[wrapper, chatListIsOpen && mobileChatListOpen]}>
      <Box sx={listHeader}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <TextField
            variant="outlined"
            size="small"
            color={user.current_role === AUDITOR ? 'secondary' : 'primary'}
            sx={searchFieldSx}
            value={search}
            onChange={handleSearch}
            inputProps={{
              style: searchInputStyle,
              ...addTestsLabel('search-input'),
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            aria-label="Close"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={() => setChatListIsOpen(false)}
            color="inherit"
            sx={closeButtonSx}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="span" sx={chatsLabel}>
          Chats
        </Typography>
      </Box>

      <Box sx={chatListSx}>
        <ChatListItem user={user} setListIsOpen={setChatListIsOpen} />
        <ChatListItem user={user} setListIsOpen={setChatListIsOpen} />
        <ChatListItem user={user} setListIsOpen={setChatListIsOpen} />
        <ChatListItem user={user} setListIsOpen={setChatListIsOpen} />
      </Box>
    </Box>
  );
};

export default ChatList;

const wrapper = theme => ({
  width: '30%',
  borderRight: '2px solid #e5e5e5',
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
});

const mobileChatListOpen = theme => ({
  [theme.breakpoints.down('xs')]: {
    background: '#fcfaf6',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 20,
    display: 'block',
    width: '70%',
  },
  [theme.breakpoints.down('xxs')]: {
    width: '100%',
  },
});

const listHeader = theme => ({
  height: '85px',
  borderBottom: '2px solid #e5e5e5',
  padding: '10px 15px',
  [theme.breakpoints.down('sm')]: {
    height: '75px',
  },
});

const searchFieldSx = theme => ({
  width: '100%',
  mb: '13px',
});

const searchInputStyle = {
  height: '30px',
  fontSize: '16px',
  fontWeight: 500,
  padding: 0,
};

const chatsLabel = {
  fontSize: '16px',
  fontWeight: 500,
  color: '#B2B3B3',
};

const chatListSx = theme => ({
  direction: 'rtl',
  background: '#fcfaf6',
  maxHeight: '693px',
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    width: '4px',
  },
  [theme.breakpoints.down('sm')]: {
    maxHeight: '706px',
  },
  [theme.breakpoints.down('xs')]: {
    maxHeight: '86vh',
  },
});

const closeButtonSx = theme => ({
  display: 'none',
  [theme.breakpoints.down('xs')]: {
    display: 'inline-flex',
    pt: '4px',
    pl: '15px',
  },
});
