import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import Layout from '../styles/Layout.jsx';
import { CustomCard } from '../components/custom/Card';
import ChatList from '../components/Chat/ChatList.jsx';
import CurrentChat from '../components/Chat/CurrentChat.jsx';
import {
  chatSetError,
  getChatListByOrg,
  setCurrentChat,
} from '../redux/actions/chatActions.js';
import theme from '../styles/themes.js';
import MenuIcon from '@mui/icons-material/Menu.js';
import { useNavigate, useSearchParams } from 'react-router-dom/dist';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';
import { AUDITOR, CUSTOMER } from '../redux/actions/types.js';
import Headings from '../router/Headings.jsx';
import CustomSnackbar from '../components/custom/CustomSnackbar.jsx';
import { ASSET_URL } from '../services/urls.js';

const ChatPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const matchXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [chatListIsOpen, setChatListIsOpen] = useState(matchXs && !id);
  const { chatList, chatMessages, currentChat, error, orgChatList } =
    useSelector(s => s.chat);
  const { user } = useSelector(s => s.user);
  const { auditor } = useSelector(s => s.auditor);
  const { customer } = useSelector(s => s.customer);
  const { organizations } = useSelector(s => s.organization);
  const [searchParams, setSearchParams] = useSearchParams();

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

  const profile = useMemo(() => {
    if (user.current_role === AUDITOR) {
      return auditor;
    } else {
      return customer;
    }
  }, [user.current_role]);

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

  const handleChoose = org => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (org) {
      newSearchParams.set('org', org.id);
      navigate('/chat' + `?org=${org.id}`);
      //
    } else {
      newSearchParams.delete('org');
    }

    if (newSearchParams.get('org') === 'undefined') {
      newSearchParams.delete('org');
      setSearchParams(newSearchParams);
    }
  };

  useEffect(() => {
    if (searchParams.get('org')) {
      dispatch(getChatListByOrg(user.current_role, searchParams.get('org')));
    }
  }, [searchParams.get('org')]);

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
              // gap: '10px',
              borderRight: '2px solid #e5e5e5',
              padding: '13px 0 5px',
            }}
          >
            <Tooltip title={'Personal'} arrow placement={'top'}>
              <>
                <Box
                  sx={[
                    { padding: '5px' },
                    !searchParams.get('org')
                      ? selectedTab(
                          theme,
                          user.current_role.toLowerCase() ===
                            AUDITOR.toLowerCase(),
                        )
                      : {},
                  ]}
                  onClick={handleChoose}
                >
                  <Avatar
                    sx={{
                      width: '65px',
                      height: '60px',
                    }}
                    src={
                      profile?.avatar ? `${ASSET_URL}/${profile.avatar}` : null
                    }
                  />
                </Box>
                <Divider />
              </>
            </Tooltip>
            {organizations.map(org => (
              <Tooltip title={org.name} key={org.id} arrow placement={'top'}>
                <Box
                  sx={[
                    { padding: '5px' },
                    searchParams.get('org') === org.id
                      ? selectedTab(
                          theme,
                          user.current_role.toLowerCase() ===
                            AUDITOR.toLowerCase(),
                        )
                      : {},
                  ]}
                  onClick={() => handleChoose(org)}
                >
                  <Avatar
                    sx={{
                      width: '65px',
                      height: '60px',
                    }}
                    src={org?.avatar ? `${ASSET_URL}/${org.avatar}` : null}
                  />
                </Box>
              </Tooltip>
            ))}
          </Box>
          <ChatList
            chatList={!searchParams.get('org') ? chatList : orgChatList}
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

const selectedTab = (theme, primary) => ({
  backgroundColor: primary
    ? theme.palette.primary.main
    : theme.palette.primary.main,
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
