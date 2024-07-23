import {
  CREATE_ORGANIZATION,
  GET_MY_ORGANIZATION,
  GET_ORGANIZATION_BY_ID,
  UPDATE_ORGANIZATION,
  CLEAR_ORGANIZATION,
} from '../actions/types.js';

const initialState = {
  organizations: [],
  own: [],
  includeMe: [],
  organization: {},
};

export const organizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_ORGANIZATION:
      return {
        ...state,
        organizations: [...action.payload.owner, ...action.payload.member],
        own: action.payload.owner,
        includeMe: action.payload.member,
      };
    case CREATE_ORGANIZATION:
      return {
        ...state,
        organization: [...state.organization, action.payload],
        own: [...state.own, action.payload],
      };
    case UPDATE_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
        own: state.own.map(el =>
          el.id === action.payload.id ? action.payload : el,
        ),
      };
    case GET_ORGANIZATION_BY_ID:
      return {
        ...state,
        organization: action.payload,
      };
    case CLEAR_ORGANIZATION:
      return {
        ...state,
        organization: {},
      };
    default:
      return state;
  }
};
