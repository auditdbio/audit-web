import {
  PROJECT_CREATE,
  GET_PROJECTS,
  GET_MY_PROJECTS,
  PROJECT_UPDATE,
  SEARCH_PROJECTS,
  PROJECT_UPDATE_STATUS,
  CLEAR_SUCCESS,
  CLOSE_THE_PROJECT,
  LOG_OUT,
  GET_CURRENT_PROJECT,
  GET_MY_PROJECT,
  CLEAR_MY_PROJECT,
  GET_MY_PROJECTS_AMOUNT,
} from '../actions/types.js';

const initialState = {
  projects: [],
  myProjects: null,
  recentProject: null,
  error: null,
  searchProjects: null,
  message: null,
  searchTotalProjects: 0,
  currentProject: null,
  totalProjects: 0,
  myProject: null,
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
      return {
        ...state,
        projects: action.payload.result,
        searchTotalProjects: action.payload.totalDocuments,
      };
    case GET_MY_PROJECTS_AMOUNT:
      return {
        ...state,
        totalProjects: action.payload.totalDocuments,
      };
    case GET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload,
      };
    case PROJECT_UPDATE:
      return {
        ...state,
        recentProject: action.payload,
        myProjects: state.myProjects.map(project => {
          if (project.id === action.payload.id) {
            return action.payload;
          }
          return project;
        }),
      };
    case PROJECT_UPDATE_STATUS:
      return {
        ...state,
        message: `Project ${
          action.payload.publish_options?.publish ? 'published' : 'hidden'
        }`,
        recentProject: action.payload,
        myProjects: state.myProjects.map(project => {
          if (project.id === action.payload.id) {
            return action.payload;
          }
          return project;
        }),
      };
    case CLEAR_MY_PROJECT:
      return {
        ...state,
        myProject: null,
      };
    case GET_MY_PROJECT:
      return {
        ...state,
        myProject: action.payload,
      };
    case CLOSE_THE_PROJECT:
      return {
        ...state,
        message: 'Project closed',
        recentProject: action.payload,
        myProjects: state.myProjects.map(project => {
          if (project.id === action.payload.id) {
            return action.payload;
          }
          return project;
        }),
      };
    case GET_MY_PROJECTS:
      return {
        ...state,
        myProjects: action.payload.result,
        totalProjects: action.payload.totalDocuments,
      };
    case SEARCH_PROJECTS:
      return {
        ...state,
        searchProjects: action.payload.result,
        searchTotalProjects: action.payload.totalDocuments,
      };
    case CLEAR_SUCCESS: {
      return { ...state, message: null };
    }
    case LOG_OUT:
      return {
        ...state,
        myProjects: null,
        recentProject: null,
        error: null,
        searchProjects: null,
        message: null,
        searchTotalProjects: 0,
        currentProject: null,
      };
    default:
      return state;
  }
};
