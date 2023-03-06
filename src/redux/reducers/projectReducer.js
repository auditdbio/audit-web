import { PROJECT_CREATE, GET_PROJECTS } from "../actions/types.js";

const initialState = {
  projects: null,
  error: null,
};
export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_CREATE:
      return state;
    case GET_PROJECTS:
      return {...state, projects: action.payload};
    default:
      return state;
  }
};
