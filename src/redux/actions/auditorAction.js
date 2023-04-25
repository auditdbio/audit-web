import Cookies from "js-cookie";
import axios from "axios";
import {GET_AUDITOR, GET_AUDITORS, SEARCH_AUDITOR, SEARCH_PROJECTS, UPDATE_AUDITOR} from "./types.js";
import {history} from "../../services/history.js";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_BASE_URL

export const getAuditor = (values) => {
    const token = Cookies.get('token')
    return (dispatch) => {
        axios.get(`${API_URL}/my_auditor`, {headers: {"Authorization": `Bearer ${token}`}})
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
        axios.post(`${API_URL}/auditor`, values, {headers: {"Authorization": `Bearer ${token}`}})
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
        axios.patch(`${API_URL}/my_auditor`, values, {headers: {"Authorization": `Bearer ${token}`}})
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
    return (dispatch) => {
        axios
            .get(`${API_URL}/search?query=${values}&tags=&sort_order=1&page=0&per_page=0&kind=auditor`)
            .then(({ data }) => {
                dispatch({ type: GET_AUDITORS, payload: data });
            })
            .catch(({ response }) => {
                console.log(response, "res")
            });
    };
};

export const searchAuditor = (values) => {
    const searchValues = {
        query: values?.search || '',
        tags: values?.tags || '',
        ready_to_wait: values?.ready_to_wait || '',
        dateFrom: +new Date() + 60000 < +new Date(values?.dateFrom) ? dayjs().valueOf(values?.dateFrom) : '',
        dateTo: +new Date() + 60000 < +new Date(values?.dateTo) ? dayjs().valueOf(values?.dateTo) : '',
        priceFrom: parseInt(values?.price.from) || '',
        priceTo: parseInt(values?.price.to) || '',
        sort: values?.sort || 1,
    }

    return (dispatch) => {
        axios
            .get(`${API_URL}/search?query=${searchValues.query}&tags=${searchValues.tags.map(tag => tag).join(',')}${searchValues.ready_to_wait ? `&ready_to_wait=${searchValues.ready_to_wait}` : ''}&sort_by=price${searchValues.priceFrom ? `&price_from=${searchValues.priceFrom}` : ''}${searchValues.priceTo ? `&price_to=${searchValues.priceTo}` : ''}${searchValues.date_from ? `&date_from=${searchValues.dateFrom}` : ''}${searchValues.dateTo ? `&date_to=${searchValues.dateTo}`: ''}&sort_order=${searchValues.sort}&page=0&per_page=0&kind=auditor`)
            .then(({ data }) => {
                dispatch({ type: GET_AUDITORS, payload: data });
            })
            .catch(({ response }) => {
                console.log(response, "res");
            });
    };
};