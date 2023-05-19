import {
  RECEIVE_MESSAGE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_DISCONNECT,
} from './types.js';

export const websocketConnect = () => {
  return { type: WEBSOCKET_CONNECT };
};

export const websocketDisconnect = () => {
  return { type: WEBSOCKET_DISCONNECT };
};

export const receiveMessage = message => {
  return { type: RECEIVE_MESSAGE, payload: message };
};
// export const websocketSend = message => {
//   return { type: WEBSOCKET_SEND, message };
// };
