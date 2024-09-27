import {
  CLEAR_CURRENT_AUDITOR_CUSTOMER,
  CLEAR_MESSAGES,
  CUSTOMER_SET_ERROR,
  GET_CURRENT_CUSTOMER,
  GET_CUSTOMER,
  GET_CUSTOMERS,
  LOG_OUT,
  SELECT_ROLE,
  UPDATE_CUSTOMER,
} from '../actions/types.js';

const initialState = {
  customer: null,
  customers: [],
  searchTotalCustomers: 0,
  error: null,
  success: null,
  currentCustomer: null,
};

export const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CUSTOMER:
      return { ...state, customer: action.payload };
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customer: action.payload.customer,
        success: action.payload.message,
      };
    case 'NEW_VALUES':
      return { ...state, customer: action.payload };
    case GET_CURRENT_CUSTOMER:
      return {
        ...state,
        currentCustomer: action.payload,
      };
    case SELECT_ROLE:
      return { ...state, currentCustomer: null };
    case GET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload.result,
        searchTotalCustomers: action.payload.totalDocuments,
      };
    case CUSTOMER_SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        error: null,
        success: null,
      };
    case CLEAR_CURRENT_AUDITOR_CUSTOMER:
      return {
        ...state,
        currentCustomer: null,
      };
    case LOG_OUT:
      return initialState;
    default:
      return state;
  }
};
