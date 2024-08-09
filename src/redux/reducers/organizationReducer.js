import {
  CREATE_ORGANIZATION,
  GET_MY_ORGANIZATION,
  GET_ORGANIZATION_BY_ID,
  UPDATE_ORGANIZATION,
  CLEAR_ORGANIZATION,
  DELETE_INVITES,
  ACCEPT_INVITE,
} from '../actions/types.js';

const initialState = {
  organizations: [],
  own: [],
  includeMe: [],
  organization: {},
  invites: [],
};

export const organizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MY_ORGANIZATION:
      return {
        ...state,
        organizations: [...action.payload.owner, ...action.payload.member],
        own: action.payload.owner,
        includeMe: action.payload.member,
        invites: action.payload.invites,
      };
    case CREATE_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
        organizations: [...state.organizations, action.payload],
        own: [...state.own, action.payload],
      };
    case UPDATE_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
        own: state.own.map(el =>
          el.id === action.payload.id ? action.payload : el,
        ),
        organizations: state.organizations.map(el =>
          el.id === action.payload.id ? action.payload : el,
        ),
      };
    case GET_ORGANIZATION_BY_ID:
      return {
        ...state,
        organization: action.payload,
      };
    case DELETE_INVITES:
      return {
        ...state,
        invites: state.invites.filter(el => el.id !== action.payload.id),
      };
    case ACCEPT_INVITE:
      return {
        ...state,
        invites: state.invites.filter(el => el.id !== action.payload.id),
        organizations: [...state.organizations, action.payload],
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
