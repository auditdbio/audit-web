import React, { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material';
import { addTestsLabel } from '../../lib/helper.js';
import ChatIcon from '../icons/ChatIcon.jsx';
import { AUDITOR, CUSTOMER } from '../../redux/actions/types.js';
import { setCurrentChat } from '../../redux/actions/chatActions.js';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ASSET_URL } from '../../services/urls.js';

const TypeChat = ({ auditor, project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { chatList } = useSelector(s => s.chat);
  const { user } = useSelector(s => s.user);
  const { organizations } = useSelector(s => s.organization);
  const myAuditor = useSelector(s => s.auditor.auditor);
  const myCustomer = useSelector(s => s.customer.customer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const startChat = () => {
    window.scrollTo(0, 0);

    const existingChat = chatList.find(chat =>
      chat.members?.find(
        member =>
          member.id === auditor?.user_id &&
          member.role?.toLowerCase() === AUDITOR,
      ),
    );
    const chatId = existingChat ? existingChat.id : auditor?.user_id;
    const members = [auditor?.user_id, user.id];

    dispatch(
      setCurrentChat(chatId, {
        name: auditor.first_name,
        avatar: auditor.avatar,
        role: AUDITOR,
        isNew: !existingChat,
        members,
      }),
    );
    localStorage.setItem('path', window.location.pathname);
    navigate(`/chat/${existingChat ? existingChat.id : auditor?.user_id}`);
  };

  const myUser = useMemo(() => {
    if (user?.current_role?.toLowerCase() === AUDITOR.toLowerCase()) {
      return myAuditor;
    } else {
      return myCustomer;
    }
  }, [myAuditor, myCustomer]);

  //
  const handleSendMessage = e => {
    // TODO add check for pm or org chat
    if (organizations.length) {
      setAnchorEl(e.currentTarget);
    } else {
      startChat();
    }
  };

  const chatFromOrg = org => {
    console.log(org);
    window.scrollTo(0, 0);

    if (auditor) {
      const existingChat = chatList.find(chat =>
        chat.members?.find(
          member =>
            member.id === auditor?.user_id &&
            member.role?.toLowerCase() === AUDITOR,
        ),
      );

      const chatId = existingChat ? existingChat.id : auditor?.user_id;
      const members = [auditor?.user_id, user.id];

      dispatch(
        setCurrentChat(chatId, {
          name: auditor.first_name,
          avatar: auditor.avatar,
          role: AUDITOR,
          isNew: !existingChat,
          members,
        }),
      );
      localStorage.setItem('path', window.location.pathname);
      navigate(
        `/chat/${existingChat ? existingChat.id : auditor?.user_id}?org=${
          org.id
        }`,
      );
    } else if (project) {
      const existingChat = chatList.find(chat =>
        chat.members?.find(
          member =>
            member.id === project?.customer_id &&
            member.role?.toLowerCase() === CUSTOMER,
        ),
      );
      const chatId = existingChat ? existingChat.id : project?.customer_id;
      const members = [project?.customer_id, user.id];

      dispatch(
        setCurrentChat(chatId, {
          role: CUSTOMER,
          isNew: !existingChat,
          userDataId: project?.customer_id,
          members,
        }),
      );
      localStorage.setItem('path', window.location.pathname);
      navigate(`/chat/${project?.customer_id}?org=${org.id}`);
    }
  };

  //
  return (
    <>
      <Button
        variant="text"
        // sx={[findButton, messageButton]}
        onClick={handleSendMessage}
        disabled={auditor?.user_id === user.id}
        {...addTestsLabel('message-button')}
      >
        <ChatIcon />
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
            '& .MuiListItemAvatar-root': {
              marginTop: 'unset',
            },
          }}
        >
          <ListItem
            sx={{
              cursor: 'pointer',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: '#e8e8e8',
              },
            }}
            onClick={startChat}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Avatar
                src={myUser?.avatar ? `${ASSET_URL}/${myUser?.avatar}` : ''}
              />
            </ListItemAvatar>
            <ListItemText primary={'Personal message'} />
          </ListItem>
          <Divider variant="inset" component="li" />
          {organizations.map(org => {
            console.log(`${ASSET_URL}/${org.avatar}`);
            return (
              <>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => chatFromOrg(org)}
                  sx={{
                    cursor: 'pointer',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: '#e8e8e8',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar alt={org.name} src={`${ASSET_URL}/${org.avatar}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={org.name}
                    // secondary={
                    //   <Typography
                    //     component="span"
                    //     variant="body2"
                    //     sx={{ color: 'text.primary', display: 'inline' }}
                    //   >
                    //     {org.name}
                    //   </Typography>
                    // }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            );
          })}
        </List>
      </Popover>
    </>
  );
};

export default TypeChat;
