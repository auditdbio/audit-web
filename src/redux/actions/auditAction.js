import Cookies from "js-cookie";
import axios from "axios";
import {
    AUDIT_REQUEST_CREATE, AUDITOR,
    CONFIRM_AUDIT,
    DELETE_REQUEST,
    GET_AUDIT_REQUEST,
    GET_AUDITS,
    PROJECT_CREATE, SUBMIT_AUDIT
} from "./types.js";
import {history} from "../../services/history.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createRequest = (values) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios
            .post(`${API_URL}/requests`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                dispatch({ type: AUDIT_REQUEST_CREATE, payload: data });
            })
            .catch(({ response }) => {
                console.log(response, "res");
            });
    };
};

export const getAuditsRequest = (role) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios
            .get(`${API_URL}/requests?role=${role}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                dispatch({ type: GET_AUDIT_REQUEST, payload: data });
                // history.push("/home-customer", {
                //     some: true
                // });
            })
    };
};

export const getAudits = (role) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios
            .get(`${API_URL}/audit?role=${role}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                dispatch({ type: GET_AUDITS, payload: data });
                // history.push("/home-customer", {
                //     some: true
                // });
            })
    };
};

export const deleteAudit = (id) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios.delete(`${API_URL}/requests/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
            }).then(({data}) => {
            dispatch({type: DELETE_REQUEST, payload: data})
        })
    }
}

export const submitAudit = (id) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios.patch(`${API_URL}/audit/change_status`, {
            id: id,
            status: 'done'
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(({data}) => {
            dispatch({type: SUBMIT_AUDIT, payload: data})
            history.back()
        })
    }
}

export const addReportAudit = (values) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios.patch(`${API_URL}/audit/add_report`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(({data}) => {
            history.push("/profile/projects", {
                some: true
            });
            dispatch(getAudits(AUDITOR))
        })
    }
}

export const confirmAudit = (values) => {
    return (dispatch) => {
        const token = Cookies.get("token");
        axios.post(`${API_URL}/audit`, values, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then(({data}) => {
            console.log(data)
            history.back()
            dispatch({type: CONFIRM_AUDIT, payload: data})
        })
    }
}