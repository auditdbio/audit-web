import {
  AUDITOR,
  CUSTOMER,
  DISCONNECTED_WS,
  GET_NEW_AUDIT,
  GET_NEW_REQUEST,
  IN_PROGRESS,
  NEED_UPDATE,
  REQUEST_DECLINE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
} from '../actions/types.js';
import { w3cwebsocket as WebSocket } from 'websocket';
import Cookies from 'js-cookie';
import {
  receiveAuditorMessage,
  receiveCustomerMessage,
} from '../actions/websocketAction.js';
import {
  deleteChatMessage,
  receiveNewChatMessage,
} from '../actions/chatActions.js';

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
              store.dispatch(
                receiveNewChatMessage(message.payload.ChatMessage),
              );
            } else if (message.kind.toLowerCase() === 'chatdeletemessage') {
              store.dispatch(
                deleteChatMessage(message.payload.ChatDeleteMessage),
              );
            } else if (message.kind.toLowerCase() === 'requestdecline') {
              store.dispatch({
                type: REQUEST_DECLINE,
                payload: message.payload.RequestDecline,
              });
            } else if (message.kind.toLowerCase() === 'versionupdate') {
              store.dispatch({
                type: NEED_UPDATE,
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
