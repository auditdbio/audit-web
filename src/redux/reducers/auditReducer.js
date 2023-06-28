import {
  AUDIT_REQUEST_CREATE,
  CLEAR_MESSAGES,
  CONFIRM_AUDIT,
  DELETE_AUDIT,
  DELETE_REQUEST,
  GET_AUDIT_REQUEST,
  GET_AUDITS,
  IN_PROGRESS,
  REQUEST_ERROR,
  RESOLVED,
  SET_CURRENT_AUDIT_PARTNER,
  SUBMIT_AUDIT,
  LOG_OUT,
  GET_AUDIT,
  GET_REQUEST,
  CLEAR_AUDIT_REQUEST,
  CLEAR_AUDIT,
} from '../actions/types.js';

const initialState = {
  audits: null,
  audit: null,
  auditRequests: null,
  auditRequest: null,
  error: null,
  successMessage: null,
  currentAuditPartner: null,
};
export const auditReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUDIT_REQUEST_CREATE:
      return {
        ...state,
        auditRequests: [...state.auditRequests, action.payload],
        successMessage: 'Audit request created successfully',
      };
    case GET_AUDIT_REQUEST:
      return { ...state, auditRequests: action.payload };
    case DELETE_REQUEST:
      return {
        ...state,
        auditRequests: state.auditRequests.filter(
          request => request.id !== action.payload.id,
        ),
      };
    case DELETE_AUDIT:
      return {
        ...state,
        audits: state.audits.filter(
          request => request.id !== action.payload.id,
        ),
      };
    case GET_AUDITS:
      return { ...state, audits: action.payload };
    case GET_REQUEST:
      return {
        ...state,
        auditRequest: action.payload,
        auditRequests: state.auditRequests?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
      };
    case GET_AUDIT:
      return {
        ...state,
        audit: action.payload,
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
      };
    case CLEAR_AUDIT_REQUEST:
      return {
        ...state,
        auditRequest: null,
      };
    case CLEAR_AUDIT:
      return {
        ...state,
        audit: null,
      };
    case CONFIRM_AUDIT:
      return {
        ...state,
        audits: [...state.audits, action.payload],
        auditRequests: state.auditRequests.filter(
          request => request.project_id !== action.payload.project_id,
        ),
      };
    case IN_PROGRESS:
      return {
        ...state,
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
      };
    case RESOLVED:
      return {
        ...state,
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
        successMessage: 'Audit resolved successfully',
      };
    case SUBMIT_AUDIT:
      return {
        ...state,
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
      };
    case SET_CURRENT_AUDIT_PARTNER:
      return { ...state, currentAuditPartner: action.payload };
    case REQUEST_ERROR:
      return { ...state, error: 'Error while processing request' };
    case CLEAR_MESSAGES:
      return { ...state, error: null, successMessage: null };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
