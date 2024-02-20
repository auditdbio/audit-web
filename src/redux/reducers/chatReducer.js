import {
  CHAT_CLOSE_CURRENT_CHAT,
  CHAT_GET_LIST,
  CHAT_GET_MESSAGES,
  CHAT_NEW_MESSAGE,
  CHAT_SEND_FIRST_MESSAGE,
  CHAT_SET_CURRENT,
  CHAT_SET_ERROR,
  CHAT_UPDATE_DIFFERENT_ROLE_UNREAD,
  CHAT_UPDATE_READ,
  CHAT_UPDATE_TOTAL_UNREAD,
} from '../actions/types.js';

const initialState = {
  chatList: [],
  chatMessages: [],
  currentChat: null,
  unreadMessages: 0,
  differentRoleUnreadMessages: 0,
  error: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAT_GET_LIST:
      return { ...state, chatList: action.payload };
    case CHAT_SET_CURRENT:
      return { ...state, currentChat: action.payload };
    case CHAT_UPDATE_READ:
      return {
        ...state,
        chatList: state.chatList.map(chat =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                unread: chat.unread.map(unread =>
                  unread.id === action.payload.userId
                    ? { ...unread, unread: action.payload.unread }
                    : unread,
                ),
              }
            : chat,
        ),
      };
    case CHAT_UPDATE_TOTAL_UNREAD:
      return {
        ...state,
        unreadMessages: action.payload,
      };
    case CHAT_UPDATE_DIFFERENT_ROLE_UNREAD:
      return {
        ...state,
        differentRoleUnreadMessages: action.payload,
      };
    case CHAT_GET_MESSAGES:
      return { ...state, chatMessages: action.payload };
    case CHAT_NEW_MESSAGE:
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload],
        currentChat: {
          ...state.currentChat,
          unread: state.currentChat?.unread?.map(member =>
            action.payload.from?.id !== member.id
              ? { ...member, unread: member.unread + 1 }
              : { ...member, unread: 0 },
          ),
        },
      };
    case CHAT_SEND_FIRST_MESSAGE:
      return {
        ...state,
        currentChat: {
          ...state.currentChat,
          isNew: false,
          chatId: action.payload?._id?.$oid, // todo: change id field in backend
        },
      };
    case CHAT_CLOSE_CURRENT_CHAT:
      return { ...state, chatMessages: [], currentChat: null };
    case CHAT_SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
