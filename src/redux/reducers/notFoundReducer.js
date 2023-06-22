import { CLEAR_REQUEST, NOT_FOUND } from '../actions/types.js';

const initialState = {
  error: false,
};

export const notFoundReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOT_FOUND:
      return { ...state, error: true };
    case CLEAR_REQUEST:
      return { ...state, error: false };
    default:
      return state;
  }
};
