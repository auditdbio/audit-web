import Cookies from "js-cookie";
import axios from "axios";
import {GET_AUDITOR, GET_AUDITORS, SEARCH_AUDITOR, SEARCH_PROJECTS, UPDATE_AUDITOR} from "./types.js";
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
                history.push({pathname: `/profile/user-info`}, {
                    some: true,
                })
            })
            .catch(({response}) => {
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
                history.push({pathname: `/profile/user-info`}, {
                    some: true,
                })
            })
            .catch(({response}) => {
                // dispatch({type: SIGN_IN_ERROR})
            })
    }
}

export const getAuditors = (values='') => {
    const token = Cookies.get("token");
    return (dispatch) => {
        axios
            .get(`${API_URL}/auditors/all?tags=${values.toLowerCase()}&limit=100&skip=0`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(({ data }) => {
                dispatch({ type: GET_AUDITORS, payload: data.auditors });
            })
            .catch(({ response }) => {
                console.log(response, "res")
            });
    };
};

export const searchAuditor = (values) => {
    const searchValues = {
        query: values?.search || '',
        tags: values?.tags || [],
        order: values?.order || '1',
    }

    return (dispatch) => {
        axios
            .get(`${API_URL}/search?query=${searchValues.query}&tags=${searchValues.tags.map(tag => tag + ',')}&sort_by=price&sort_order=${searchValues.order}&page=0&per_page=0&kind=auditor`)
            .then(({ data }) => {
                dispatch({ type: SEARCH_AUDITOR, payload: data });
            })
            .catch(({ response }) => {
                console.log(response, "res");
            });
    };
};