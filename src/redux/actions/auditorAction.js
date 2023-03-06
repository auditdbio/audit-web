import Cookies from "js-cookie";
import axios from "axios";
import {GET_AUDITOR, GET_CUSTOMER, UPDATE_AUDITOR, UPDATE_CUSTOMER} from "./types.js";
import {history} from "../../services/history.js";

const API_URL = import.meta.env.VITE_API_BASE_URL

export const getAuditor = (values) => {
    const token = Cookies.get('token')
    return (dispatch) => {
        axios.get(`${API_URL}/auditors`, {headers: {"Authorization": `Bearer ${token}`}})
            .then(({data}) => {
                dispatch({type: GET_AUDITOR, payload: data})
            })
            .catch(({response}) => {
                console.log(response, 'res')
                // dispatch({type: SIGN_IN_ERROR})
            })
    }
}

export const createAuditor = (values) => {
    const token = Cookies.get('token')
    return (dispatch) => {
        axios.post(`${API_URL}/auditors`, values, {headers: {"Authorization": `Bearer ${token}`}})
            .then(({data}) => {
                dispatch({type: UPDATE_AUDITOR, payload: data})
                history.push({pathname: `/profile`}, {
                    some: true,
                })
            })
            .catch(({response}) => {
                console.log(response, 'res')
                // dispatch({type: SIGN_IN_ERROR})
            })
    }
}

export const updateAuditor = (values) => {
    const token = Cookies.get('token')
    return (dispatch) => {
        axios.patch(`${API_URL}/auditors`, values, {headers: {"Authorization": `Bearer ${token}`}})
            .then(({data}) => {
                dispatch({type: UPDATE_AUDITOR, payload: data})
                history.push({pathname: `/profile`}, {
                    some: true,
                })
            })
            .catch(({response}) => {
                console.log(response, 'res')
                // dispatch({type: SIGN_IN_ERROR})
            })
    }
}