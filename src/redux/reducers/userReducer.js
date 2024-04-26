import Cookies from 'js-cookie';
import {
  AUTH_TRUE,
  CLEAR_ERROR,
  LOG_OUT,
  SIGN_IN_ERROR,
  USER_IS_ALREADY_EXIST,
  USER_SIGNIN,
  USER_SIGNUP,
  SELECT_ROLE,
  UPDATE_USER,
  CLEAR_SUCCESS,
  CHANGE_ROLE_HAVE_PROFILE_CUSTOMER,
  CHANGE_ROLE_DONT_HAVE_PROFILE_CUSTOMER,
  CHANGE_ROLE_HAVE_PROFILE_AUDITOR,
  CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
  RESTORE_PASSWORD,
  SEND_EMAIL,
  CONNECT_ACCOUNT,
  CHANGE_ACCOUNT_VISIBILITY,
  ERROR_ADD_ACCOUNT,
  ERROR_IDENTITY,
  GET_PROFILE,
  GET_PUBLIC_PROFILE,
  CLEAR_MESSAGES,
  GET_MY_PROFILE,
  NOT_AUTHENTICATED,
} from '../actions/types.js';

const initialState = {
  token: Cookies.get('token') || '',
  isAuth: false,
  user: {},
  loading: true,
  error: null,
  success: null,
  publicUser: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_SIGNIN:
      return {
        token: action.payload.token,
        isAuth: true,
        user: action.payload.user,
      };
    case USER_SIGNUP:
      return {
        ...state,
        user: action.payload,
        success:
          'An authorization email has been sent to your email address, please check your email',
      };
    case CONNECT_ACCOUNT:
      return {
        ...state,
        user: {
          ...state.user,
          linked_accounts: [...state.user.linked_accounts, action.payload],
        },
      };
    case GET_PROFILE:
      return {
        ...state,
        user: action.payload,
      };
    case GET_PUBLIC_PROFILE:
      return {
        ...state,
        publicUser: action.payload,
      };
    case CHANGE_ACCOUNT_VISIBILITY:
      return {
        ...state,
        user: {
          ...state.user,
          linked_accounts: state.user.linked_accounts.map(account => {
            if (account.id === action.payload.id) {
              return action.payload;
            }
            return account;
          }),
        },
      };
    case NOT_AUTHENTICATED:
      return {
        ...state,
        loading: false,
      };
    case AUTH_TRUE:
      return { ...state, isAuth: true };
    case USER_IS_ALREADY_EXIST:
      return { ...state, error: 'User already exists' };
    case CLEAR_ERROR:
      return { ...state, error: null };
    case SIGN_IN_ERROR:
      return { ...state, error: action.payload };
    case LOG_OUT:
      return { ...initialState, token: '', user: {} };
    case SELECT_ROLE:
      return { ...state, user: action.payload };
    case UPDATE_USER:
      return {
        ...state,
        user: action.payload,
        success: 'Success! Your password has been changed',
      };
    case RESTORE_PASSWORD:
      return {
        ...state,
        success: 'Success! Your password has been changed',
      };
    case SEND_EMAIL:
      return {
        ...state,
        success:
          'Success! The letter was sent to your email, please check your email',
      };
    case ERROR_ADD_ACCOUNT:
      return {
        ...state,
        error: 'Account has already been added',
      };
    case ERROR_IDENTITY:
      return {
        ...state,
        error: 'Access token expired, please try again',
      };
    case CLEAR_SUCCESS:
      return { ...state, success: null };
    case CLEAR_MESSAGES:
      return { ...state, success: null, error: null };
    case CHANGE_ROLE_HAVE_PROFILE_CUSTOMER:
      return {
        ...state,
        user: action.payload,
        success: 'Switched to customer role',
      };
    case CHANGE_ROLE_DONT_HAVE_PROFILE_CUSTOMER:
      return {
        ...state,
        user: action.payload,
        success: 'Fill your customer profile and create some projects',
      };
    case CHANGE_ROLE_HAVE_PROFILE_AUDITOR:
      return {
        ...state,
        user: action.payload,
        success: 'Switched to auditor role',
      };
    case CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR:
      return {
        ...state,
        user: action.payload,
        success: 'Fill your auditor profile',
      };
    case GET_MY_PROFILE:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
