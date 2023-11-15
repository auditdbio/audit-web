import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { searchAuditor } from '../../redux/actions/auditorAction.js';

const ChatList = ({ chatList, chatListIsOpen, setChatListIsOpen }) => {
  const dispatch = useDispatch();
  const { auditors } = useSelector(s => s.auditor);
  const { user } = useSelector(s => s.user);

  const [, startTransition] = useTransition();
  const [search, setSearch] = useState('');

  const handleSearch = e => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    startTransition(() => {
      if (search.trim()) {
        dispatch(searchAuditor({ search, perPage: 0 }));
        // TODO: add customers search
      }
    });
  }, [search]);

  return (
    <>
      <Box sx={[wrapper, chatListIsOpen && mobileChatListOpen]}>
        <Box sx={listHeader}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <TextField
              autoComplete="off"
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
          {chatList.length > 0
            ? chatList
                ?.filter(chat =>
                  chat.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase().trim()),
                )
                .reverse()
                .map(chat => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    user={user}
                    setListIsOpen={setChatListIsOpen}
                  />
                ))
            : !search && (
                <Box sx={emptyListLabel}>You haven't written to anyone yet</Box>
              )}

          {search &&
            auditors
              .filter(
                auditor =>
                  !chatList.some(chat =>
                    chat.members.some(member => member.id === auditor.user_id),
                  ),
              )
              .map(auditor => (
                <ChatListItem
                  key={auditor.user_id}
                  user={user}
                  setListIsOpen={setChatListIsOpen}
                  isNew={true}
                  role={AUDITOR}
                  chat={{
                    id: auditor.user_id,
                    name: `${auditor.first_name} ${auditor.last_name}`,
                    avatar: auditor.avatar,
                    members: [auditor.user_id, user.id],
                  }}
                />
              ))}

          {/*TODO: Add customers search*/}

          {chatList.length > 0 &&
            !chatList.find(chat =>
              chat.name?.toLowerCase().includes(search.toLowerCase().trim()),
            ) && <Box sx={emptyListLabel}>No search results</Box>}
        </Box>
      </Box>
      <Box
        sx={chatListIsOpen ? mobileChatListOpenBackground : {}}
        onClick={() => setChatListIsOpen(false)}
      />
    </>
  );
};

export default ChatList;

const wrapper = theme => ({
  width: '30%',
  borderRight: '2px solid #e5e5e5',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('xs')]: {
    display: 'none',
  },
});

const mobileChatListOpen = theme => ({
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    width: '4px',
  },
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

const mobileChatListOpenBackground = theme => ({
  display: 'none',
  [theme.breakpoints.down('xs')]: {
    display: 'block',
    width: '30%',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    background: 'rgba(0, 0, 0, .1)',
  },
  [theme.breakpoints.down('xxs')]: {
    display: 'none',
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

const chatListSx = {
  direction: 'rtl',
  background: '#fcfaf6',
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    width: '4px',
  },
};

const closeButtonSx = theme => ({
  display: 'none',
  [theme.breakpoints.down('xs')]: {
    display: 'inline-flex',
    pt: '4px',
    pl: '15px',
  },
});

const emptyListLabel = {
  padding: '0 15px',
  pt: '30px',
  textAlign: 'center',
};
