import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../../services/urls.js';
import {
  AUDITOR,
  CUSTOMER,
  CHAT_CLOSE_CURRENT_CHAT,
  CHAT_GET_LIST,
  CHAT_GET_MESSAGES,
  CHAT_NEW_MESSAGE,
  CHAT_SEND_FIRST_MESSAGE,
  CHAT_SET_CURRENT,
  CHAT_UPDATE_READ,
  CHAT_UPDATE_TOTAL_UNREAD,
  CHAT_UPDATE_DIFFERENT_ROLE_UNREAD,
  CHAT_SET_ERROR,
} from './types.js';

export const getChatList = role => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/chat/preview/${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => dispatch({ type: CHAT_GET_LIST, payload: data }));
  };
};

export const getChatMessages = (chatId, userId) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: CHAT_GET_MESSAGES, payload: data });
        axios
          .patch(`${API_URL}/chat/${chatId}/unread/0`, null, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            dispatch({
              type: CHAT_UPDATE_READ,
              payload: {
                chatId,
                userId,
                unread: 0,
              },
            });
          });
      });
  };
};

export const setCurrentChat = (
  chatId,
  { name, avatar, role, members, isNew = false, userDataId = false },
) => {
  return (dispatch, getState) => {
    const { chat } = getState();
    const chatList = chat.chatList;
    const unread = chatList.find(chat => chat.id === chatId)?.unread || [];

    const previousChatId = chat?.currentChat?.chatId;
    if (previousChatId === chatId) return;

    if (previousChatId) {
      const token = Cookies.get('token');
      axios.patch(`${API_URL}/chat/${previousChatId}/unread/0`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    dispatch({ type: CHAT_CLOSE_CURRENT_CHAT });

    if (userDataId) {
      axios.get(`${API_URL}/${role}/${userDataId}`).then(({ data }) => {
        dispatch({
          type: CHAT_SET_CURRENT,
          payload: {
            chatId,
            name: data.first_name,
            avatar: data.avatar,
            isNew,
            role,
            members,
          },
        });
      });
    }

    dispatch({
      type: CHAT_SET_CURRENT,
      payload: { chatId, name, avatar, isNew, role, members, unread },
    });
  };
};

export const chatSendMessage = (text, to, role, isFirst, kind = 'Text') => {
  const token = Cookies.get('token');
  return dispatch => {
    let values;

    if (isFirst) {
      values = {
        to: { id: to.id, role: to.role },
        role,
        text,
        kind,
      };
    } else {
      values = {
        chat: to.id,
        role,
        text,
        kind,
      };
    }

    axios
      .post(`${API_URL}/chat/message`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (isFirst) {
          const payload = data.Private || data.Group;
          dispatch({ type: CHAT_SEND_FIRST_MESSAGE, payload });
        }
      });
  };
};

export const receiveNewChatMessage = message => {
  return (dispatch, getState) => {
    const { chat: chatState, user } = getState();
    if (chatState.currentChat?.chatId === message.chat) {
      dispatch({
        type: CHAT_NEW_MESSAGE,
        payload: message,
      });

      const chat = chatState.chatList.find(chat => chat.id === message.chat);
      const interlocutor = chat?.members.find(
        member => member.id !== user.user?.id,
      );
      const unread = chat?.unread?.find(
        member => member.id !== user.user?.id,
      )?.unread;

      dispatch({
        type: CHAT_UPDATE_READ,
        payload: {
          chatId: message.chat,
          userId: interlocutor?.id,
          unread: unread + 1,
        },
      });
    } else {
      const chat = chatState.chatList.find(it => it.id === message.chat);
      if (chat) {
        const unread =
          chat.unread?.find(unread => unread.id === user.user?.id)?.unread || 0;

        dispatch({
          type: CHAT_UPDATE_READ,
          payload: {
            chatId: message.chat,
            userId: user.user?.id,
            unread: unread + 1,
          },
        });
      } else {
        dispatch({
          type: CHAT_UPDATE_DIFFERENT_ROLE_UNREAD,
          payload: chatState.differentRoleUnreadMessages + 1,
        });
      }
    }
  };
};

export const getTotalUnreadMessages = chatList => {
  return (dispatch, getState) => {
    const { user } = getState();
    const unread = chatList.reduce((acc, chat) => {
      return (
        acc +
        (chat?.unread?.find(unread => unread.id === user.user?.id)?.unread || 0)
      );
    }, 0);

    dispatch({ type: CHAT_UPDATE_TOTAL_UNREAD, payload: unread });
  };
};

export const getUnreadForDifferentRole = () => {
  const token = Cookies.get('token');
  return (dispatch, getState) => {
    const { user } = getState();
    const role = user.user.current_role === AUDITOR ? CUSTOMER : AUDITOR;
    axios
      .get(`${API_URL}/chat/preview/${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const unread = data.reduce((acc, chat) => {
          return (
            acc +
            (chat?.unread?.find(unread => unread.id === user.user?.id)
              ?.unread || 0)
          );
        }, 0);
        dispatch({ type: CHAT_UPDATE_DIFFERENT_ROLE_UNREAD, payload: unread });
      });
  };
};

export const closeCurrentChat = chatId => {
  if (chatId) {
    const token = Cookies.get('token');
    axios.patch(`${API_URL}/chat/${chatId}/unread/0`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  return { type: CHAT_CLOSE_CURRENT_CHAT };
};

export const chatSetError = error => {
  return { type: CHAT_SET_ERROR, payload: error };
};
