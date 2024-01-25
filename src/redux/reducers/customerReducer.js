import {
  GET_CURRENT_CUSTOMER,
  GET_CUSTOMER,
  GET_CUSTOMERS,
  LOG_OUT,
  UPDATE_CUSTOMER,
} from '../actions/types.js';

const initialState = {
  customer: null,
  customers: [],
  searchTotalCustomers: 0,
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
    case GET_CURRENT_CUSTOMER:
      return {
        ...state,
        currentCustomer: action.payload,
      };
    case GET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload.result,
        searchTotalCustomers: action.payload.totalDocuments,
      };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
