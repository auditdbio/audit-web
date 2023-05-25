import {
  ADD_AUDIT_ISSUE,
  AUDIT_REQUEST_CREATE,
  CLEAR_MESSAGES,
  CONFIRM_AUDIT,
  DELETE_AUDIT,
  DELETE_REQUEST,
  GET_AUDIT_REQUEST,
  GET_AUDITS,
  REQUEST_ERROR,
  SUBMIT_AUDIT,
  UPDATE_AUDIT_ISSUE,
} from '../actions/types.js';

const initialState = {
  audits: null,
  auditRequests: null,
  error: null,
  successMessage: null,
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
    case CONFIRM_AUDIT:
      return {
        ...state,
        audits: [...state.audits, action.payload],
        auditRequests: state.auditRequests.filter(
          request => request.project_id !== action.payload.project_id,
        ),
      };
    case SUBMIT_AUDIT:
      return {
        ...state,
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
      };
    case ADD_AUDIT_ISSUE:
      return {
        ...state,
        successMessage: 'Audit issue created successfully',
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id
            ? { ...audit, issues: [...audit.issues, action.payload.issue] }
            : audit,
        ),
      };
    case UPDATE_AUDIT_ISSUE:
      const payload = action.payload;
      return {
        ...state,
        successMessage: 'Changes saved successfully',
        audits: state.audits?.map(audit =>
          audit.id === payload.id
            ? {
                ...audit,
                issues: audit.issues.map(issue =>
                  issue.id === payload.issue.id ? payload.issue : issue,
                ),
              }
            : audit,
        ),
      };
    case REQUEST_ERROR:
      return { ...state, error: 'Error while processing request' };
    case CLEAR_MESSAGES:
      return { ...state, error: null, successMessage: null };
    default:
      return state;
  }
};
