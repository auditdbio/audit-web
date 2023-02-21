import axios from "axios";
import Cookies from 'js-cookie'
import {history} from "../../services/history.js";
import {AUTH_TRUE, USER_SIGNIN, USER_SIGNUP} from "./types.js";

const API_URL = 'http://dev.auditdb.io:3001/api'


export const signIn = (values) => {

    return (dispatch) => {
        axios.post(`${API_URL}/auth/login`, values)
            .then(({data}) => {
                Cookies.set('token', data.token, {expires: 1})
                sessionStorage.setItem('token', JSON.stringify(data.token))
                dispatch({type: USER_SIGNIN, payload: data})
                history.push({pathname: `/home-${data.user.current_role}`}, {
                    some: true,
                })
            })
    }
}

export const signUp = (values) => {

    return (dispatch) => {
        axios.post(`${API_URL}/users`, values)
            .then(({data}) => {
                dispatch({type: USER_SIGNUP, payload: data})
                history.push('/sign-in', {
                    some: true,
                })
            })
    }
}

export const authenticate = () =>{
    return {type: AUTH_TRUE}
}

export const logout = () => {
    history.push('/')
    Cookies.remove('token')
    sessionStorage.removeItem('token')
    return {type: 'LOG_OUT'}
}