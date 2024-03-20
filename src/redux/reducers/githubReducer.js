import {
  CLEAR_COMMIT,
  CLEAR_REPO_OWNER,
  GET_BRANCHES,
  GET_COMMIT,
  GET_COMMIT_DATA,
  GET_COMMITS,
  GET_DEFAULT_BRANCH,
  GET_REPO_OWNER,
  GET_TOTAL_COMMITS,
  GET_MY_GITHUB_REPOSITORIES,
  GET_MY_GITHUB_ORGANIZATION,
  GET_MY_GITHUB_ORGANIZATION_REPOSITORIES,
  GET_SHA,
} from '../actions/types.js';

const initialState = {
  sha: '',
  commits: [],
  branch: '',
  totalCommitsPage: 0,
  defaultBranch: '',
  branches: [],
  commit: {},
  commitInfo: {},
  repoOwner: '',
  myRepositories: [],
  myOrganizations: [],
  organizationRepositories: [],
};

export const githubReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_BRANCHES:
      return { ...state, branches: action.payload };
    case GET_COMMITS:
      return {
        ...state,
        commits: action.payload,
      };
    case GET_COMMIT:
      return {
        ...state,
        commitInfo: action.payload,
      };
    case GET_DEFAULT_BRANCH:
      return {
        ...state,
        defaultBranch: action.payload,
      };
    case GET_TOTAL_COMMITS:
      return {
        ...state,
        totalCommitsPage: action.payload,
      };
    case GET_COMMIT_DATA:
      return {
        ...state,
        commit: action.payload,
        sha: action.payload.sha,
      };
    case GET_SHA:
      return {
        ...state,
        sha: action.payload,
      };
    case CLEAR_COMMIT:
      return {
        ...state,
        commit: {},
        commitInfo: {},
        sha: '',
      };
    case GET_REPO_OWNER:
      return {
        ...state,
        repoOwner: action.payload,
      };
    case CLEAR_REPO_OWNER:
      return {
        ...state,
        repoOwner: '',
      };
    case GET_MY_GITHUB_REPOSITORIES:
      return {
        ...state,
        myRepositories: action.payload,
      };
    case GET_MY_GITHUB_ORGANIZATION:
      return {
        ...state,
        myOrganizations: action.payload,
      };
    case GET_MY_GITHUB_ORGANIZATION_REPOSITORIES:
      return {
        ...state,
        organizationRepositories: action.payload,
      };
    default:
      return state;
  }
};
