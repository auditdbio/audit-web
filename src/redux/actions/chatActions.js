import Cookies from 'js-cookie';
import axios from 'axios';
import { API_URL } from '../../services/urls.js';
import {
  CHAT_CLOSE_CURRENT_CHAT,
  CHAT_GET_LIST,
  CHAT_GET_MESSAGES,
  CHAT_SEND_FIRST_MESSAGE,
  CHAT_SET_CURRENT,
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

export const getChatMessages = id => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => dispatch({ type: CHAT_GET_MESSAGES, payload: data }));
  };
};

export const setCurrentChat = (
  chatId,
  { name, avatar, role, isNew = false, userDataId = false },
) => {
  return dispatch => {
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
          },
        });
      });
    }

    dispatch({
      type: CHAT_SET_CURRENT,
      payload: { chatId, name, avatar, isNew, role },
    });
  };
};

export const chatSendMessage = (text, to, role, isFirst) => {
  const token = Cookies.get('token');
  return dispatch => {
    let values;

    if (isFirst) {
      values = {
        to: { id: to.id, role: to.role },
        role,
        text,
      };
    } else {
      values = {
        chat: to.id,
        role,
        text,
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

export const closeCurrentChat = () => {
  return { type: CHAT_CLOSE_CURRENT_CHAT };
};
