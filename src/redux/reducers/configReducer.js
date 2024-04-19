import { GET_CONFIG_FILTER } from '../actions/types.js';

const initialState = {
  filterConfig: [],
};

export const filterConfig = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONFIG_FILTER:
      return {
        ...state,
        filterConfig: action.payload,
      };
    default:
      return state;
  }
};
