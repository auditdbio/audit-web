import {
  GET_AUDITOR,
  GET_AUDITORS,
  SEARCH_AUDITOR,
  UPDATE_AUDITOR,
  LOG_OUT,
  GET_CURRENT_AUDITOR,
  DELETE_BADGE,
  CLEAR_MESSAGES,
  AUDITOR_SET_ERROR,
  SELECT_ROLE,
  GET_AUDITOR_RATING_DETAILS,
  CLEAR_CURRENT_AUDITOR_CUSTOMER,
} from '../actions/types.js';

const initialState = {
  auditor: null,
  auditors: [],
  searchAuditors: null,
  searchTotalAuditors: 0,
  error: null,
  success: null,
  currentAuditor: null,
  auditorRating: null,
};

export const auditorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUDITOR:
      return { ...state, auditor: action.payload };
    case UPDATE_AUDITOR:
      return {
        ...state,
        auditor: action.payload.auditor,
        success: action.payload.message,
      };
    case GET_AUDITOR_RATING_DETAILS:
      return {
        ...state,
        auditorRating: action.payload,
      };
    case SEARCH_AUDITOR:
      return { ...state, searchAuditors: action.payload };
    case GET_AUDITORS:
      return {
        ...state,
        auditors: action.payload.result,
        searchTotalAuditors: action.payload.totalDocuments,
      };
    case GET_CURRENT_AUDITOR:
      return {
        ...state,
        currentAuditor: action.payload,
      };
    case SELECT_ROLE:
      return { ...state, currentAuditor: null };
    case LOG_OUT:
      return {
        ...state,
        auditor: null,
        currentAuditor: null,
        error: null,
        success: null,
      };
    case DELETE_BADGE:
      return {
        ...state,
        auditors: state.auditors.filter(
          auditor => auditor.id !== action.payload,
        ),
      };
    case AUDITOR_SET_ERROR:
      return {
        ...state,
        success: null,
        error: action.payload,
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        success: null,
        error: null,
      };
    case CLEAR_CURRENT_AUDITOR_CUSTOMER:
      return {
        ...state,
        currentAuditor: null,
      };
    default:
      return state;
  }
};
