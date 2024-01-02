import {
  GET_AUDITOR,
  GET_AUDITORS,
  SEARCH_AUDITOR,
  UPDATE_AUDITOR,
  LOG_OUT,
  GET_CURRENT_AUDITOR,
  DELETE_BADGE,
  CLEAR_MESSAGES,
  CLEAR_AUDITOR,
} from '../actions/types.js';

const initialState = {
  auditor: null,
  auditors: [],
  searchAuditors: null,
  searchTotalAuditors: 0,
  error: null,
  currentAuditor: null,
};
export const auditorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUDITOR:
      return { ...state, auditor: action.payload };
    case UPDATE_AUDITOR:
      return { ...state, auditor: action.payload };
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
    case CLEAR_AUDITOR:
      return {
        ...state,
        currentAuditor: null,
      };
    case LOG_OUT:
      return { ...state, auditor: null, currentAuditor: null };
    case DELETE_BADGE:
      return {
        ...state,
        auditors: state.auditors.filter(
          auditor => auditor.id !== action.payload,
        ),
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
