import {
    AUDIT_REQUEST_CREATE, DELETE_REQUEST,
    GET_AUDIT_REQUEST, GET_AUDITS
} from "../actions/types.js";

const initialState = {
    audits: null,
    auditRequests: null,
    error: null,
};
export const auditReducer = (state = initialState, action) => {

    switch (action.type) {
        case AUDIT_REQUEST_CREATE:
            return {...state, auditRequests: [...state.auditRequests, action.payload]};
        case GET_AUDIT_REQUEST:
            return {...state, auditRequests: action.payload.audits};
        case DELETE_REQUEST:
            return {...state, auditRequests: state.auditRequests.filter(request => request.id !== action.payload.id)}
        case GET_AUDITS:
            return {...state, audits: action.payload}
        default:
            return state;
    }
};
