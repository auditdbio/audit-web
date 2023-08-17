import React, { useState } from 'react';
import { Box } from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import ChatList from '../components/Chat/ChatList.jsx';
import CurrentChat from '../components/Chat/CurrentChat.jsx';

const ChatPage = () => {
  const [chatListIsOpen, setChatListIsOpen] = useState(false);

  return (
    <Layout sx={layoutSx}>
      <CustomCard sx={wrapper}>
        <Box sx={chatWrapper}>
          <ChatList
            chatListIsOpen={chatListIsOpen}
            setChatListIsOpen={setChatListIsOpen}
          />
          <CurrentChat setChatListIsOpen={setChatListIsOpen} />
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
  padding: '65px 40px 100px',
  position: 'relative',
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    padding: '30px 30px 50px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '20px 15px 50px',
  },
});

const chatWrapper = {
  width: '100%',
  display: 'flex',
  border: '2px solid #e5e5e5',
  position: 'relative',
};
