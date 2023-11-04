import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import ChatList from '../components/Chat/ChatList.jsx';
import CurrentChat from '../components/Chat/CurrentChat.jsx';
import { setCurrentChat } from '../redux/actions/chatActions.js';
import theme from '../styles/themes.js';
import MenuIcon from '@mui/icons-material/Menu.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [chatListIsOpen, setChatListIsOpen] = useState(false);
  const { chatList, chatMessages, currentChat } = useSelector(s => s.chat);

  useEffect(() => {
    if (id && !currentChat?.isNew) {
      const chat = chatList.find(it => it.id === id);
      const members = chat?.members.map(member => member.id);

      dispatch(
        setCurrentChat(chat?.id, {
          name: chat?.name,
          avatar: chat?.avatar,
          members,
        }),
      );
    }
  }, [id, chatList]);

  return (
    <Layout sx={layoutSx}>
      <CustomCard sx={wrapper}>
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
  padding: '65px 40px 100px',
  position: 'relative',
  display: 'flex',
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
