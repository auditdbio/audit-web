import {
  DISCONNECTED_WS,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
  // WEBSOCKET_SEND_MESSAGE,
  // receiveMessage
} from '../actions/types.js';
import { w3cwebsocket as WebSocket } from 'websocket';
import Cookies from 'js-cookie';
import {
  receiveMessage,
  websocketConnect,
} from '../actions/websocketAction.js';

const API_URL = import.meta.env.VITE_API_WS_BASE_URL;

const websocketMiddleware = () => {
  let socket = null;
  return store => next => action => {
    switch (action.type) {
      case WEBSOCKET_CONNECT:
        if (!socket) {
          const token = Cookies.get('token');
          const userId = localStorage.getItem('user');
          const socketUrl = `${API_URL}/notifications/${JSON.parse(userId).id}`;
          socket = new WebSocket(socketUrl);
          socket.onopen = () => {
            socket.send(token);
            store.dispatch({ type: WEBSOCKET_CONNECTED });
          };

          socket.onmessage = event => {
            const message = JSON.parse(event.data);
            store.dispatch(receiveMessage(message));
          };

          socket.onclose = () => {
            console.log('disconnected');
            socket = null;
            store.dispatch({ type: DISCONNECTED_WS });
          };
        }
        break;

      case WEBSOCKET_DISCONNECT:
        if (socket) {
          socket.close();
          socket = null;
        }
        break;

      default:
        return next(action);
    }
  };
};

export default websocketMiddleware;
