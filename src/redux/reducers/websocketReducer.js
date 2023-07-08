import {
  DISCONNECTED_WS,
  LOG_OUT,
  READ_MESSAGE,
  RECEIVE_MESSAGE,
  RECEIVE_MESSAGES,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
} from '../actions/types.js';

const initialState = {
  connected: false,
  messages: [],
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
    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [action.payload.payload.Notification, ...state.messages],
      };
    case RECEIVE_MESSAGES:
      return { ...state, messages: action.payload.reverse() };
    case READ_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(
          message => message.id !== action.payload.id,
        ),
      };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
