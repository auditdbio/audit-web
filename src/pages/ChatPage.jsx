import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Collapse,
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
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

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
  const orgId = searchParams.get('org');
  const xsMatch = useMediaQuery(theme.breakpoints.down('xs'));

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
    if (user.current_role.toLowerCase() === AUDITOR.toLowerCase()) {
      return auditor;
    } else {
      return customer;
    }
  }, [user.current_role, auditor, customer]);

  useEffect(() => {
    if (id && !currentChat?.isNew) {
      const chat = chatList.find(chat => chat.id === id);
      const chatOrg = orgChatList?.find(chat => chat.id === id);
      const members = chat?.members.map(member => member.id);
      const orgMembers = chatOrg?.members.map(member => member.id);
      const role = chat?.members.find(member => member.id !== user.id)?.role;
      const orgRole = chatOrg?.members.find(
        member => member.id !== user.id,
      )?.role;
      if (chat || chatOrg) {
        if (orgId) {
          dispatch(
            setCurrentChat(chatOrg?.id, {
              name: chatOrg?.name,
              avatar: chatOrg?.avatar,
              orgRole,
              orgMembers,
            }),
          );
        } else {
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
      if (xsMatch) {
        setChatListIsOpen(true);
      }
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
      dispatch(getChatListByOrg('Organization', searchParams.get('org')));
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '70vh',
            minHeight: '590px',
          }}
        >
          <Box sx={orgListSx}>
            <Tooltip title={'Personal'} arrow placement={'top'}>
              <>
                <Box
                  sx={[
                    orgListItemSx,
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
                    sx={orgAvatarSx}
                    src={
                      profile?.avatar ? `${ASSET_URL}/${profile.avatar}` : null
                    }
                  />
                </Box>
                {/*<Divider />*/}
              </>
            </Tooltip>
            {organizations.map(org => (
              <Tooltip title={org.name} key={org.id} arrow placement={'top'}>
                <Box
                  sx={[
                    orgListItemSx,
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
                    sx={orgAvatarSx}
                    src={org?.avatar ? `${ASSET_URL}/${org.avatar}` : null}
                  />
                </Box>
              </Tooltip>
            ))}
          </Box>
          <Box sx={chatWrapper}>
            <Box sx={[leftSideSx, chatListIsOpen && mobileChatListOpen]}>
              <ChatList
                orgId={searchParams.get('org')}
                chatList={!searchParams.get('org') ? chatList : orgChatList}
                chatListIsOpen={chatListIsOpen}
                setChatListIsOpen={setChatListIsOpen}
              />
            </Box>
            <Box
              sx={chatListIsOpen ? mobileChatListOpenBackground : {}}
              onClick={() => setChatListIsOpen(false)}
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
        </Box>
      </CustomCard>
    </Layout>
  );
};

export default ChatPage;

const orgListItemSx = theme => ({
  padding: '5px',
  borderRadius: '8px',
  width: '70px',
  [theme.breakpoints.down('sm')]: {
    width: '50px',
  },
});

const layoutSx = theme => ({
  padding: '40px !important',
  [theme.breakpoints.down('md')]: {
    padding: '20px 0 !important',
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
    bottom: '-1px',
    zIndex: 20,
    background: 'rgba(0, 0, 0, .1)',
  },
  [theme.breakpoints.down(500)]: {
    display: 'none',
  },
});

const orgListSx = theme => ({
  display: 'flex',
  flexDirection: 'column',
  // width: '70px',
  border: '2px solid #e5e5e5',
  borderRight: 'unset',
  padding: '0 0 5px',
  overflowY: 'auto',
  overflowX: 'hidden',
  height: '100%',
  '::-webkit-scrollbar': {
    width: '0px',
  },
  // [theme.breakpoints.down('md')]: {
  //   width: '73px',
  // },
});

const leftSideSx = theme => ({
  width: '30%',
  display: 'flex',
  justifyContent: 'end',
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
  [theme.breakpoints.down(500)]: {
    width: '100%',
  },
});

const orgAvatarSx = theme => ({
  width: '60px',
  height: '60px',
  [theme.breakpoints.down('sm')]: {
    width: '40px',
    height: '40px',
  },
  // backgroundColor: '#fff',
});

const selectedTab = (theme, primary) => ({
  backgroundColor: primary
    ? theme.palette.secondary.main
    : theme.palette.primary.main,
});

const wrapper = theme => ({
  minHeight: '300px',
  padding: '10px 20px 60px 5px',
  position: 'relative',
  display: 'flex',
  maxWidth: 'unset',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '15px',
  [theme.breakpoints.down('md')]: {
    borderRadius: 'unset',
  },
  [theme.breakpoints.down('sm')]: {
    // padding: '30px 30px 50px',
    minHeight: '300px',
  },
  [theme.breakpoints.down('xs')]: {
    // padding: '20px 40px 50px',
    minHeight: '300px',
    gap: '8px',
    padding: '10px 10px 30px',
  },
});

const chatWrapper = theme => ({
  height: '70vh',
  minHeight: '590px',
  width: 'calc(100% - 70px)',
  display: 'flex',
  border: '2px solid #e5e5e5',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 50px)',
  },
});

const selectLabelWrapper = {
  position: 'relative',
  width: '70%',
  // [theme.breakpoints.down(1760)]: {
  //   width: '65%',
  // },
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
