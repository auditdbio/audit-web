import {
  PROJECT_CREATE,
  GET_PROJECTS,
  GET_MY_PROJECTS,
  PROJECT_UPDATE, SEARCH_PROJECTS,
} from "../actions/types.js";

const initialState = {
  projects: null,
  myProjects: null,
  recentProject: null,
  error: null,
  searchProjects: null,
};
export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_CREATE:
      return {
        ...state,
        recentProject: action.payload,
        myProjects: [...state.myProjects, action.payload],
        projects: [...state.projects, action.payload],
      };
    case GET_PROJECTS:
      return { ...state, projects: action.payload };
    case PROJECT_UPDATE:
      return { ...state, recentProject: action.payload };
    case GET_MY_PROJECTS:
      return { ...state, myProjects: action.payload.projects };
    case SEARCH_PROJECTS:
      return { ...state, searchProjects: action.payload };
    default:
      return state;
  }
};
