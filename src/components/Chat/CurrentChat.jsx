import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Button, IconButton, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu.js';
import { ASSET_URL } from '../../services/urls.js';
import AttachIcon from '../icons/AttachIcon.jsx';
import SendMessageIcon from '../icons/SendMessageIcon.jsx';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import { addTestsLabel } from '../../lib/helper.js';
import theme from '../../styles/themes.js';
import Message from './Message.jsx';
import CustomTextarea from '../custom/CustomTextarea.jsx';
import {
  chatSendMessage,
  closeCurrentChat,
  getChatList,
  getChatMessages,
} from '../../redux/actions/chatActions.js';
import AttachFileModal from './AttachFileModal.jsx';
import Headings from '../../router/Headings.jsx';

const CurrentChat = ({
  chatMessages,
  currentChat,
  chatList,
  setChatListIsOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector(s => s.user);

  const [newMessage, setNewMessage] = useState('');
  const [attachModalIsOpen, setAttachModalIsOpen] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState(20);
  const [messagesWindowHeight, setMessagesWindowHeight] = useState(0);
  const [userLinkData, setUserLinkData] = useState({});
  const [unread, setUnread] = useState(0);
  const [interlocutorUnread, setInterlocutorUnread] = useState(0);
  const [chatId, setChatId] = useState(null);

  const messageBoxRef = useRef();
  const newMessagesTextRef = useRef();
  const userLinkDataRef = useRef({});

  useEffect(() => {
    if (
      currentChat?.chatId &&
      !currentChat?.isNew &&
      currentChat?.chatId !== chatId
    ) {
      setDisplayedMessages(20);
      setChatId(currentChat?.chatId);
      dispatch(getChatMessages(currentChat.chatId, user.id));
    }
  }, [currentChat, chatId]);

  useEffect(() => {
    if (currentChat?.chatId && id !== currentChat?.chatId) {
      navigate(`/chat/${currentChat?.chatId}`);
      dispatch(getChatList(user.current_role));
    }
  }, [currentChat?.chatId]);

  useEffect(() => {
    if (newMessagesTextRef.current) {
      newMessagesTextRef.current.scrollIntoView({
        behavior: 'auto',
        block: 'nearest',
        inline: 'nearest',
      });
      setMessagesWindowHeight(messageBoxRef.current.scrollHeight);
    } else if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
      setMessagesWindowHeight(messageBoxRef.current.scrollHeight);
    }
  }, [chatMessages, newMessagesTextRef]);

  useEffect(() => {
    if (messageBoxRef.current) {
      const scrollHeight = messageBoxRef.current.scrollHeight;
      messageBoxRef.current.scrollTop = scrollHeight - messagesWindowHeight;
      setMessagesWindowHeight(scrollHeight);
    }
  }, [displayedMessages]);

  useEffect(() => {
    const chat = chatList.find(chat => chat.id === currentChat?.chatId);
    const interlocutor = chat?.members?.find(member => member.id !== user.id);
    if (!interlocutor) {
      setUserLinkData({ id, role: currentChat?.role });
    } else {
      setUserLinkData({ id: interlocutor?.id, role: interlocutor?.role });
    }

    setUnread(
      currentChat?.unread?.find(member => member.id === user.id)?.unread || 0,
    );

    setInterlocutorUnread(
      currentChat?.unread?.find(member => member.id !== user.id)?.unread,
    );
  }, [currentChat, chatList]);

  useEffect(() => {
    if (unread > 20) {
      setDisplayedMessages(unread);
    }
  }, [unread]);

  useEffect(() => {
    userLinkDataRef.current = {
      chatId: id,
      userId: userLinkData.id,
    };
  }, [userLinkData, id]);

  useEffect(() => {
    return () => {
      if (userLinkDataRef.current?.chatId !== userLinkDataRef.current?.userId) {
        dispatch(closeCurrentChat(currentChat?.chatId));
      }
    };
  }, []);

  const handleMessageInput = e => {
    setNewMessage(e.target.value);
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    dispatch(
      chatSendMessage(
        newMessage.trim(),
        { id: currentChat?.chatId, role: currentChat?.role },
        user.current_role,
        currentChat?.isNew,
      ),
    );
    setNewMessage('');
    setUnread(0);
  };

  const messageHandleKeyDown = e => {
    if ((e.which === 13 || e.code === 'Enter') && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getDisplayedMessages = () => {
    const from = Math.max(chatMessages.length - displayedMessages, 0);
    const to = chatMessages.length;
    return [from, to];
  };

  const showMore = () => {
    setDisplayedMessages(displayedMessages + 10);
  };

  const showUserProfile = () => {
    localStorage.setItem('go-back', 'true');
  };

  const handleCreateAuditRequest = () => {
    localStorage.setItem('chat-path', `/chat/${currentChat?.chatId}`);
    if (user.current_role === AUDITOR) {
      navigate(`/customer-projects/${userLinkData.id}`);
    } else {
      navigate(`/my-projects/${userLinkData.id}`);
    }
  };

  return (
    <>
      <AttachFileModal
        isOpen={attachModalIsOpen}
        setIsOpen={setAttachModalIsOpen}
        currentChat={currentChat}
        user={user}
      />
      <Headings title={`${currentChat?.name || 'Chat'} | Chat`} />

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

          <RouterLink
            to={`/${userLinkData.role?.toLowerCase()[0]}/${userLinkData.id}`}
            onClick={showUserProfile}
          >
            <Box sx={avatarWrapper(currentChat?.role)}>
              <Avatar
                src={
                  currentChat?.avatar
                    ? `${ASSET_URL}/${currentChat.avatar}`
                    : null
                }
                sx={avatarStyle}
                alt="User photo"
              />
            </Box>
          </RouterLink>
          <Box sx={userInfo}>
            <Link
              component={RouterLink}
              to={`/${userLinkData.role?.toLowerCase()[0]}/${userLinkData.id}`}
              sx={userNameSx}
              onClick={showUserProfile}
              {...addTestsLabel('profile-link')}
            >
              {currentChat?.name}
            </Link>
            {/*<Box sx={userStatusSx({ online: true })}>Online</Box>*/}
          </Box>

          <IconButton
            color="disabled"
            aria-label="Attach file"
            onClick={() => setAttachModalIsOpen(true)}
            sx={attachButton}
          >
            <AttachIcon />
          </IconButton>
        </Box>

        <Box sx={chatSx} ref={messageBoxRef}>
          {displayedMessages < chatMessages.length && (
            <Box sx={showMoreSx}>
              <Button color="secondary" onClick={showMore}>
                Show more
              </Button>
            </Box>
          )}
          {!currentChat?.isNew ? (
            chatMessages
              .slice(...getDisplayedMessages())
              .map((msg, idx, ar) => {
                const date = new Date(msg?.time / 1000).toDateString();
                const prevMsgDate = new Date(
                  ar[idx - 1]?.time / 1000,
                ).toDateString();
                const unreadLabel = !!unread && ar.length - unread === idx;
                const isInterlocutorRead = idx < ar.length - interlocutorUnread;
                return (
                  <Box
                    key={msg.id}
                    ref={unreadLabel ? newMessagesTextRef : null}
                  >
                    {date !== prevMsgDate && (
                      <Box sx={msgDateSx}>{date.replace(/[^ ]+/, '')}</Box>
                    )}
                    {unreadLabel && <Box sx={newMessagesSx}>New messages:</Box>}
                    <Message
                      user={user}
                      message={msg}
                      currentChat={currentChat}
                      isRead={isInterlocutorRead}
                    />
                  </Box>
                );
              })
          ) : (
            <Box sx={[newMessagesSx, { borderBottom: 'none' }]}>
              No messages here yet...
            </Box>
          )}
        </Box>
        <Box sx={btnWrapper}>
          <Box sx={sendBox}>
            <CustomTextarea
              maxRows={1}
              onChange={handleMessageInput}
              onKeyDown={messageHandleKeyDown}
              value={newMessage}
              placeholder="Type here..."
              {...addTestsLabel('message-input')}
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
          <Button
            color={user.current_role === CUSTOMER ? 'secondary' : 'primary'}
            variant={'contained'}
            sx={requestBtn}
            {...addTestsLabel('request-button')}
            onClick={handleCreateAuditRequest}
          >
            Audit request
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CurrentChat;

const yearNow = new Date().getFullYear();

const requestBtn = theme => ({
  height: '55px',
  padding: '10px!important',
  textTransform: 'unset',
  borderRadius: 0,
  [theme.breakpoints.down(500)]: {
    height: '48px',
  },
});

const wrapper = theme => ({
  width: '70%',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
});

const btnWrapper = theme => ({
  display: 'flex',
  gap: '5px',
  [theme.breakpoints.down(500)]: {
    flexDirection: 'column',
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
  [theme.breakpoints.down('xxs')]: {
    padding: '12px 1px',
  },
});

const menuButtonSx = theme => ({
  display: 'none',
  mr: '10px',
  [theme.breakpoints.down('xs')]: {
    display: 'inline-flex',
  },
  [theme.breakpoints.down('xxs')]: {
    mr: '4px',
  },
});

const avatarWrapper = role => ({
  width: '60px',
  height: '60px',
  mr: '30px',
  padding: '2px',
  borderRadius: '50%',
  border: `4px solid ${
    role?.toLowerCase() === AUDITOR
      ? theme.palette.secondary.main
      : theme.palette.primary.main
  }`,
  [theme.breakpoints.down('sm')]: {
    width: '50px',
    height: '50px',
  },
  [theme.breakpoints.down('xs')]: {
    width: '40px',
    height: '40px',
    mr: '15px',
    borderWidth: '3px',
  },
  [theme.breakpoints.down('xxs')]: {
    width: '30px',
    height: '30px',
    mr: '10px',
  },
});

const avatarStyle = {
  width: '100%',
  height: '100%',
};

const userInfo = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
};

const userNameSx = theme => ({
  display: '-webkit-box',
  alignSelf: 'flex-start',
  fontSize: '24px',
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
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  rowGap: '20px',
  overflowY: 'auto',
  '::-webkit-scrollbar': {
    width: '6px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '30px 20px 20px',
    rowGap: '20px',
    '::-webkit-scrollbar': {
      width: '4px',
    },
  },
  [theme.breakpoints.down('xs')]: {
    padding: '30px 10px 20px',
    rowGap: '15px',
  },
});

const showMoreSx = {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
};

const msgDateSx = theme => ({
  fontSize: '14px',
  textAlign: 'center',
  mb: '10px',
  [theme.breakpoints.down('xs')]: {
    fontSize: '12px',
  },
});

const newMessagesSx = {
  fontSize: '14px',
  fontWeight: 500,
  color: theme.palette.secondary.main,
  textTransform: 'uppercase',
  textAlign: 'center',
  borderBottom: '1px solid #BBB',
  mb: '20px',
};

const sendBox = {
  display: 'flex',
  height: '55px',
  width: '100%',
  '& ::-webkit-scrollbar': {
    width: '8px !important',
  },
};

const sendButton = theme => ({
  padding: '10px 20px',
  borderRadius: 0,
  [theme.breakpoints.down('sm')]: {
    padding: '10px 10px',
  },
  [theme.breakpoints.down(500)]: {
    height: '53px',
  },
  [theme.breakpoints.down('xs')]: {
    padding: '10px 10px',
  },
});
