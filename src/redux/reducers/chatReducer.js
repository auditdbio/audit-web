import {
  CHAT_CLOSE_CURRENT_CHAT,
  CHAT_GET_LIST,
  CHAT_GET_MESSAGES,
  CHAT_NEW_MESSAGE,
  CHAT_SEND_MESSAGE,
  CHAT_SET_CURRENT,
} from '../actions/types.js';

const initialState = {
  chatList: [],
  chatMessages: [],
  currentChat: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_GET_LIST:
      return { ...state, chatList: action.payload };
    case CHAT_SET_CURRENT:
      return { ...state, currentChat: action.payload };
    case CHAT_GET_MESSAGES:
      return { ...state, chatMessages: action.payload };
    case CHAT_NEW_MESSAGE:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
      };
    // case CHAT_SEND_MESSAGE:
    //   return {
    //     ...state,
    //     chatMessages: [...state.chatMessages, action.payload],
    //   };
    case CHAT_CLOSE_CURRENT_CHAT:
      return { ...state, chatMessages: [], currentChat: null };
    default:
      return state;
  }
};
