import {
    AUDIT_REQUEST_CREATE, CONFIRM_AUDIT, DELETE_REQUEST,
    GET_AUDIT_REQUEST, GET_AUDITS, SUBMIT_AUDIT
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
            return {...state, audits: action.payload.audits}
        case CONFIRM_AUDIT:
            return {...state, audits: [...state.audits, action.payload]}
        case SUBMIT_AUDIT:
            return {...state, audits: state.audits?.map(audit => audit.id === action.payload.id ? action.payload : audit)}
        default:
            return state;
    }
};
