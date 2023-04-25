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
    UPDATE_USER,
    CLEAR_SUCCESS,
    CHANGE_ROLE_HAVE_PROFILE_CUSTOMER,
    CHANGE_ROLE_DONT_HAVE_PROFILE_CUSTOMER, CHANGE_ROLE_HAVE_PROFILE_AUDITOR, CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
} from "../actions/types.js";

const initialState = {
    token: Cookies.get('token') || '',
    isAuth: false,
    user: JSON.parse(localStorage.getItem('user')) || {},
    error: null,
    success: null
}
export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_SIGNIN:
            return { token: action.payload.token, isAuth: true, user: action.payload.user }
        case USER_SIGNUP:
            return {...state, user: action.payload, success: 'An authorization email has been sent to your email address, please check your email' }
        case AUTH_TRUE:
            return {...state, isAuth: true}
        case USER_IS_ALREADY_EXIST:
            return {...state, error: 'User is already exist'}
        case CLEAR_ERROR:
            return {...state, error: null}
        case SIGN_IN_ERROR:
            return {...state, error: action.payload}
        case LOG_OUT:
            return initialState
        case SELECT_ROLE:
            return {...state, user: action.payload}
        case UPDATE_USER:
            return {...state, user: action.payload, success: 'Success! Your password is changed'}
        case CLEAR_SUCCESS:
            return {...state, success: null}
        case CHANGE_ROLE_HAVE_PROFILE_CUSTOMER:
            return {...state, user: action.payload, success: 'Switched to customer role' }
        case CHANGE_ROLE_DONT_HAVE_PROFILE_CUSTOMER:
            return {...state, user: action.payload, success: 'Fill your customer profile and create some projects' }
        case CHANGE_ROLE_HAVE_PROFILE_AUDITOR:
            return {...state, user: action.payload, success: 'Switched to auditor role' }
        case CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR:
            return {...state, user: action.payload, success: 'Fill your auditor profile' }
        default:
            return state
    }
}