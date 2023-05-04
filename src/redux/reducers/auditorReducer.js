import {
  GET_AUDITOR,
  GET_AUDITORS, SEARCH_AUDITOR,
  UPDATE_AUDITOR,
  LOG_OUT
} from "../actions/types.js";

const initialState = {
  auditor: null,
  auditors: null,
  searchAuditors: null,
  error: null,
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
      return { ...state, auditors: action.payload };
    case LOG_OUT:
      return { ...state, auditor: null }
    default:
      return state;
  }
};
