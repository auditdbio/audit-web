import { GET_CUSTOMER, LOG_OUT, UPDATE_CUSTOMER } from '../actions/types.js';

const initialState = {
  customer: null,
  error: null,
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMER:
      return { ...state, customer: action.payload };
    case UPDATE_CUSTOMER:
      return { ...state, customer: action.payload };
    case 'NEW_VALUES':
      return { ...state, customer: action.payload };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
