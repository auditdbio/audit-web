import {
  GET_AUDITOR,
  GET_AUDITORS,
  UPDATE_AUDITOR,
} from "../actions/types.js";

const initialState = {
  auditor: null,
  auditors: null,
  error: null,
};
export const auditorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUDITOR:
      return { ...state, auditor: action.payload };
    case UPDATE_AUDITOR:
      return { ...state, auditor: action.payload };
    case GET_AUDITORS:
      return { ...state, auditors: action.payload };
    default:
      return state;
  }
};
