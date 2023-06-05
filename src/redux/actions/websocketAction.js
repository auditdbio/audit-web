import {
  READ_MESSAGE,
  RECEIVE_MESSAGE,
  RECEIVE_MESSAGES,
  USER_IS_ALREADY_EXIST,
  USER_SIGNUP,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
} from './types.js';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const websocketConnect = () => {
  return { type: WEBSOCKET_CONNECT };
};

export const websocketDisconnect = () => {
  return { type: WEBSOCKET_DISCONNECT };
};

export const receiveMessage = message => {
  return { type: RECEIVE_MESSAGE, payload: message };
};

export const receiveMessages = messages => {
  return { type: RECEIVE_MESSAGES, payload: messages };
};

export const readMessage = id => {
  return dispatch => {
    axios
      .patch(`${API_URL}/read_notification/${id}`)
      .then(({ data }) => {
        dispatch({ type: READ_MESSAGE, payload: data });
      })
      .catch(({ response }) => {
        dispatch({ type: USER_IS_ALREADY_EXIST });
      });
  };
};

// export const websocketSend = message => {
//   return { type: WEBSOCKET_SEND, message };
// };