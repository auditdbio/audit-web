import {
  AUDITOR,
  CUSTOMER,
  DISCONNECTED_WS,
  LOG_OUT,
  READ_MESSAGE,
  RECEIVE_AUDITOR_MESSAGE,
  RECEIVE_CUSTOMER_MESSAGE,
  RECEIVE_MESSAGES,
  REQUEST_DECLINE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
} from '../actions/types.js';

const initialState = {
  connected: false,
  customerMessages: [],
  auditorMessages: [],
  reconnect: false,
};

export const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_CONNECTED:
      return { ...state, connected: true, reconnect: false };
    case WEBSOCKET_DISCONNECT:
      return { ...state, connected: false };
    case DISCONNECTED_WS:
      return { ...state, connected: false, reconnect: true };
    case RECEIVE_MESSAGES:
      return {
        ...state,
        auditorMessages: action.payload
          .filter(message => {
            if (
              message.inner.role.toLowerCase() === AUDITOR ||
              !message.inner.role
            ) {
              return message;
            }
          })
          .reverse(),
        customerMessages: action.payload
          .filter(message => {
            if (
              message.inner.role.toLowerCase() === CUSTOMER ||
              !message.inner.role
            ) {
              return message;
            }
          })
          .reverse(),
      };
    case RECEIVE_AUDITOR_MESSAGE:
      return {
        ...state,
        auditorMessages: [
          action.payload.payload.Notification,
          ...state.auditorMessages,
        ],
      };
    case RECEIVE_CUSTOMER_MESSAGE:
      return {
        ...state,
        customerMessages: [
          action.payload.payload.Notification,
          ...state.customerMessages,
        ],
      };
    case READ_MESSAGE:
      return {
        ...state,
        customerMessages: state.customerMessages.filter(
          message => message.id !== action.payload.id,
        ),
        auditorMessages: state.auditorMessages.filter(
          message => message.id !== action.payload.id,
        ),
      };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
