import {
  AUDITOR,
  CHAT_NEW_MESSAGE,
  CHAT_SEND_MESSAGE,
  CUSTOMER,
  DISCONNECTED_WS,
  GET_NEW_AUDIT,
  GET_NEW_REQUEST,
  GET_REQUEST,
  IN_PROGRESS,
  REQUEST_DECLINE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
  // WEBSOCKET_SEND_MESSAGE,
  // receiveMessage
} from '../actions/types.js';
import { w3cwebsocket as WebSocket } from 'websocket';
import Cookies from 'js-cookie';
import {
  receiveAuditorMessage,
  receiveCustomerMessage,
  websocketConnect,
} from '../actions/websocketAction.js';
//
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
            if (message.kind.toLowerCase() === 'notification') {
              if (
                message.payload.Notification.inner.role.toLowerCase() ===
                  CUSTOMER ||
                !message.payload.Notification.inner.role
              ) {
                store.dispatch(receiveCustomerMessage(message));
              } else if (
                message.payload.Notification.inner.role.toLowerCase() ===
                  AUDITOR ||
                !message.payload.Notification.inner.role
              ) {
                store.dispatch(receiveAuditorMessage(message));
              }
            } else if (message.kind.toLowerCase() === 'newrequest') {
              store.dispatch({
                type: GET_NEW_REQUEST,
                payload: message.payload.NewRequest,
              });
            } else if (message.kind.toLowerCase() === 'newaudit') {
              store.dispatch({
                type: GET_NEW_AUDIT,
                payload: message.payload.NewAudit,
              });
            } else if (message.kind.toLowerCase() === 'auditupdate') {
              store.dispatch({
                type: IN_PROGRESS,
                payload: message.payload.AuditUpdate,
              });
            } else if (message.kind.toLowerCase() === 'chatmessage') {
              store.dispatch({
                type: CHAT_NEW_MESSAGE,
                payload: message.payload.ChatMessage,
              });
            } else if (message.kind.toLowerCase() === 'requestdecline') {
              store.dispatch({
                type: REQUEST_DECLINE,
                payload: message.payload.RequestDecline,
              });
            }
          };

          socket.onclose = () => {
            console.log('disconnected');
            socket = null;
            store.dispatch({ type: DISCONNECTED_WS });
          };
        }
        break;

      // case CHAT_SEND_MESSAGE:
      //   if (socket) {
      //     const message = {
      //       kind: 'ChatMessage',
      //       text: action.payload?.text,
      //       to: action.payload?.to,
      //       is_first: action.payload?.isFirst || false,
      //     };
      //     socket.send(JSON.stringify(message));
      //   }
      //   break;

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
