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
  BRANCH_NAME,
  PREV_PAGE,
  NEXT_PAGE,
  CLEAR_COMMITINFO,
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
  commitPage: 1,
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
    case PREV_PAGE:
      return {
        ...state,
        commitPage: action.payload,
      };
    case NEXT_PAGE:
      return {
        ...state,
        commitPage: action.payload,
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
    case BRANCH_NAME:
      return {
        ...state,
        branch: action.payload,
        commitPage: 1,
      };
    case CLEAR_COMMITINFO:
      return {
        ...state,
        commitInfo: {},
      };
    case CLEAR_COMMIT:
      return {
        ...state,
        commit: {},
        commitInfo: {},
        sha: '',
        commitPage: 1,
        commits: [],
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
        branch: '',
        branches: [],
        defaultBranch: '',
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
