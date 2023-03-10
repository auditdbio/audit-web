import {PROJECT_CREATE, GET_PROJECTS, GET_MY_PROJECTS} from "../actions/types.js";

const initialState = {
  projects: null,
  myProjects: null,
  error: null,
};
export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_CREATE:
      return state;
    case GET_PROJECTS:
      return {...state, projects: action.payload};
    case GET_MY_PROJECTS:
      return {...state, myProjects: action.payload.projects}
    default:
      return state;
  }
};
