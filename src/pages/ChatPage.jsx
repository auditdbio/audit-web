import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Button, IconButton } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import ChatList from '../components/Chat/ChatList.jsx';
import CurrentChat from '../components/Chat/CurrentChat.jsx';
import { chatSetError, setCurrentChat } from '../redux/actions/chatActions.js';
import theme from '../styles/themes.js';
import MenuIcon from '@mui/icons-material/Menu.js';
import { useNavigate } from 'react-router-dom/dist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const [chatListIsOpen, setChatListIsOpen] = useState(false);
  const { chatList, chatMessages, currentChat } = useSelector(s => s.chat);
  const { user } = useSelector(s => s.user);
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);

  useEffect(() => {
    if (
      (user.current_role === AUDITOR &&
        auditor &&
        !auditor?.user_id &&
        !auditor?.first_name) ||
      (user.current_role === CUSTOMER &&
        customer &&
        !customer?.user_id &&
        !customer?.first_name)
    ) {
      dispatch(chatSetError('Fill your profile'));
      navigate('/profile/user-info');
    }
  }, [user, auditor, customer]);

  useEffect(() => {
    if (id && !currentChat?.isNew) {
      const chat = chatList.find(chat => chat.id === id);
      const members = chat?.members.map(member => member.id);
      const role = chat?.members.find(member => member.id !== user.id)?.role;

      if (chat) {
        dispatch(
          setCurrentChat(chat?.id, {
            name: chat?.name,
            avatar: chat?.avatar,
            role,
            members,
          }),
        );
      }
    }
  }, [id, chatList.length]);

  const handleGoBack = () => {
    if (localStorage.getItem('path')) {
      navigate(localStorage.getItem('path'));
      localStorage.removeItem('path');
    } else {
      navigate(-1);
    }
  };

  return (
    <Layout sx={layoutSx}>
      <CustomCard sx={wrapper}>
        <Button
          variant={'text'}
          sx={{ textTransform: 'unset', ml: '-15px', paddingLeft: '0' }}
          onClick={handleGoBack}
        >
          <ArrowBackIcon />
        </Button>
        <Box sx={chatWrapper}>
          <ChatList
            chatList={chatList}
            chatListIsOpen={chatListIsOpen}
            setChatListIsOpen={setChatListIsOpen}
          />
          {id ? (
            <CurrentChat
              chatMessages={chatMessages}
              currentChat={currentChat}
              chatList={chatList}
              setChatListIsOpen={setChatListIsOpen}
            />
          ) : (
            <Box sx={selectLabelWrapper}>
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

              <Box sx={selectChatLabel}>
                Please select a chat to start messaging...
              </Box>
            </Box>
          )}
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default ChatPage;

const layoutSx = theme => ({
  paddingY: '40px !important',
  [theme.breakpoints.down('xs')]: {
    paddingY: '20px !important',
  },
});

const wrapper = theme => ({
  minHeight: '300px',
  padding: '20px 40px 100px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '15px',
  [theme.breakpoints.down('sm')]: {
    padding: '30px 30px 50px',
    minHeight: '300px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '20px 15px 50px',
    minHeight: '300px',
  },
});

const chatWrapper = {
  height: '70vh',
  minHeight: '590px',
  width: '100%',
  display: 'flex',
  border: '2px solid #e5e5e5',
  position: 'relative',
};

const selectLabelWrapper = {
  position: 'relative',
  width: '70%',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
};

const selectChatLabel = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
};

const menuButtonSx = theme => ({
  display: 'none',
  mr: '10px',
  [theme.breakpoints.down('xs')]: {
    display: 'inline-flex',
  },
});
