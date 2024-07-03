import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Avatar, Box, Button, IconButton, useMediaQuery } from '@mui/material';
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
import Headings from '../router/Headings.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [chatListIsOpen, setChatListIsOpen] = useState(matchXs && !id);
  const { chatList, chatMessages, currentChat, error } = useSelector(
    s => s.chat,
  );
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
      const role = user.current_role?.[0];
      navigate(`/${role}/${user.id}`);
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
      <Headings title="Chat" noIndex={true} />

      <CustomSnackbar
        autoHideDuration={5000}
        open={!!error}
        severity="error"
        text={error}
        onClose={() => dispatch(chatSetError(null))}
      />

      <CustomCard sx={wrapper}>
        <Button
          variant="text"
          sx={{ textTransform: 'unset', ml: '-15px', paddingLeft: '0' }}
          onClick={handleGoBack}
        >
          <ArrowBackIcon />
        </Button>
        <Box sx={chatWrapper}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              borderRight: '2px solid #e5e5e5',
              padding: '10px 0',
            }}
          >
            <Box sx={{ padding: '8px' }}>
              <Avatar
                sx={{
                  width: '65px',
                  height: '60px',
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                PM
              </Avatar>
            </Box>
            <Box
              sx={{
                padding: '8px',
                backgroundColor: 'rgba(255,153,0,0.69)',
                borderRadius: '8px',
              }}
            >
              <Avatar
                sx={{
                  width: '65px',
                  height: '60px',
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                Org1
              </Avatar>
            </Box>
            <Box sx={{ padding: '8px' }}>
              <Avatar
                sx={{
                  width: '65px',
                  height: '60px',
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                Org1
              </Avatar>
            </Box>
            <Box sx={{ padding: '8px' }}>
              <Avatar
                sx={{
                  width: '65px',
                  height: '60px',
                  backgroundColor: theme.palette.secondary.main,
                }}
              >
                Org1
              </Avatar>
            </Box>
          </Box>
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
  maxWidth: 'unset',
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
