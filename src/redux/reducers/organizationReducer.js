import {
  CREATE_ORGANIZATION,
  GET_MY_ORGANIZATION,
  GET_ORGANIZATION_BY_ID,
  UPDATE_ORGANIZATION,
  CLEAR_ORGANIZATION,
  DELETE_INVITES,
  ACCEPT_INVITE,
  NOT_FOUND_ORGANIZATION,
  ADD_MEMBER_IN_ORGANIZATION,
  CLEAR_MESSAGES,
  GET_ORGANIZATIONS,
} from '../actions/types.js';

const initialState = {
  organizations: [],
  own: [],
  searchOrganizations: [],
  includeMe: [],
  organization: {},
  invites: [],
  notFound: false,
  successMessage: '',
  loading: true,
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
        loading: false,
      };
    case ADD_MEMBER_IN_ORGANIZATION:
      return {
        ...state,
        successMessage: 'User successfully invited',
      };
    case GET_ORGANIZATIONS: {
      return {
        ...state,
        searchOrganizations: action.payload.result,
      };
    }
    case CLEAR_MESSAGES:
      return {
        ...state,
        successMessage: '',
      };
    case CREATE_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
        organizations: [...state.organizations, action.payload],
        own: [...state.own, action.payload],
      };
    case NOT_FOUND_ORGANIZATION:
      return {
        ...state,
        notFound: true,
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
