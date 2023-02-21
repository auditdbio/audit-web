import Cookies from 'js-cookie'
import {AUTH_TRUE, USER_SIGNIN, USER_SIGNUP} from "../actions/types.js";

const initialState = {
    token: Cookies.get('token') || '',
    isAuth: false,
    user: {}
}
export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_SIGNIN:
            return { token: action.payload.token, isAuth: true, user: action.payload.user }
        case USER_SIGNUP:
            return {...state, user: action.payload }
        case AUTH_TRUE:
            return {...state, isAuth: true}
        case 'LOG_OUT':
            return initialState
        default:
            return state
    }
}