import Cookies from 'js-cookie'
import {
    AUTH_TRUE,
    CLEAR_ERROR,
    LOG_OUT,
    SIGN_IN_ERROR,
    USER_IS_ALREADY_EXIST,
    USER_SIGNIN,
    USER_SIGNUP,
    SELECT_ROLE,
} from "../actions/types.js";

const initialState = {
    token: Cookies.get('token') || '',
    isAuth: false,
    user: JSON.parse(localStorage.getItem('user')) || {},
    error: null,
}
export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_SIGNIN:
            return { token: action.payload.token, isAuth: true, user: action.payload.user }
        case USER_SIGNUP:
            return {...state, user: action.payload }
        case AUTH_TRUE:
            return {...state, isAuth: true}
        case USER_IS_ALREADY_EXIST:
            return {...state, error: 'User is already exist'}
        case CLEAR_ERROR:
            return {...state, error: null}
        case SIGN_IN_ERROR:
            return {...state, error: 'Email or password incorrect'}
        case LOG_OUT:
            return initialState
        case SELECT_ROLE:
            return {...state,  user: action.payload}
        default:
            return state
    }
}