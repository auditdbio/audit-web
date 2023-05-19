import {
  RECEIVE_MESSAGE,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CONNECTED,
  WEBSOCKET_DISCONNECT,
} from '../actions/types.js';

const initialState = {
  connected: false,
  messages: [],
};

export const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case WEBSOCKET_CONNECTED:
      return { ...state, connected: true };
    case WEBSOCKET_DISCONNECT:
      return { ...state, connected: false };
    case RECEIVE_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};
