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
  GET_NEW_REQUEST,
  GET_NEW_AUDIT,
  REQUEST_DECLINE,
  DOWNLOAD_REPORT_START,
  CREATE_PUBLIC_REPORT,
  GET_PUBLIC_REPORT,
  RESET_PUBLIC_AUDIT,
  EDIT_AUDIT,
  SAVE_PUBLIC_REPORT,
  EDIT_AUDIT_REQUEST_CUSTOMER,
} from '../actions/types.js';

const initialState = {
  audits: [],
  audit: null,
  auditRequests: [],
  auditRequest: null,
  error: null,
  successMessage: null,
  currentAuditPartner: null,
  publicReport: {},
};
export const auditReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUDIT_REQUEST_CREATE:
      return {
        ...state,
        auditRequests: [...state.auditRequests, action.payload],
        successMessage: 'Audit request created successfully',
        auditRequest: action.payload,
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
    case EDIT_AUDIT:
      return {
        ...state,
        audits: state.audits.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
        audit: action.payload,
        successMessage: 'Saved successfully',
      };
    case EDIT_AUDIT_REQUEST_CUSTOMER:
      return {
        ...state,
        auditRequests: state.auditRequests.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
        auditRequest: action.payload,
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
    case RESET_PUBLIC_AUDIT:
      return {
        ...state,
        publicReport: {},
      };
    case GET_NEW_AUDIT:
      return {
        ...state,
        audits: [action.payload, ...state.audits],
        auditRequests: state.auditRequests.filter(
          request => request.id !== action?.payload?.id,
        ),
      };
    case GET_NEW_REQUEST:
      const newRequests = state.auditRequests.filter(
        request => request.id !== action?.payload?.id,
      );
      return {
        ...state,
        auditRequests: [action.payload, ...newRequests],
      };
    case GET_AUDIT:
      return {
        ...state,
        audit: action.payload,
        audits: state.audits?.map(audit =>
          audit.id === action.payload.id ? action.payload : audit,
        ),
      };
    case REQUEST_DECLINE:
      return {
        ...state,
        auditRequests: state.auditRequests.filter(
          audit => audit.id !== action.payload,
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
    case CREATE_PUBLIC_REPORT:
      return {
        ...state,
        publicReport: action.payload,
      };
    case GET_PUBLIC_REPORT:
      return {
        ...state,
        publicReport: action.payload,
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
        audit: action.payload,
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
    case SAVE_PUBLIC_REPORT: {
      return {
        ...state,
        audits: [...state.audits, action.payload],
        successMessage: 'Public report saved successfully in audits',
        publicReport: {},
      };
    }
    case SET_CURRENT_AUDIT_PARTNER:
      return { ...state, currentAuditPartner: action.payload };
    case REQUEST_ERROR:
      return { ...state, error: 'Error while processing request' };
    case DOWNLOAD_REPORT_START:
      return { ...state, successMessage: 'The report is loading' };
    case CLEAR_MESSAGES:
      return { ...state, error: null, successMessage: null };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
