import {
  BRANCH_NAME,
  CLEAR_COMMIT,
  CLEAR_REPO_OWNER,
  GET_BRANCHES,
  GET_COMMIT,
  GET_COMMIT_DATA,
  GET_COMMITS,
  GET_DEFAULT_BRANCH,
  GET_MY_GITHUB_ORGANIZATION,
  GET_MY_GITHUB_ORGANIZATION_REPOSITORIES,
  GET_MY_GITHUB_REPOSITORIES,
  GET_REPO_OWNER,
  GET_SHA,
  GET_TAGS,
  GET_TOTAL_COMMITS,
} from './types.js';
import axios from 'axios';
import Cookies from 'js-cookie';
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getBranches = repoOwner => {
  const token = Cookies.get('token');
  return async dispatch => {
    try {
      let allBranches = [];
      let page = 1;
      let perPage = 100;

      while (true) {
        const response = await fetch(
          `${API_URL}/github/repos/${repoOwner}/branches?per_page=${perPage}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        if (data.length === 0) {
          break;
        } else {
          page++;
        }
        allBranches = [...allBranches, ...data.map(branch => branch.name)];
      }
      dispatch({ type: GET_BRANCHES, payload: allBranches });
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };
};

export const getTags = repoOwner => {
  return dispatch => {
    axios(`${API_URL}/github/repos/${repoOwner}/tags`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).then(({ data }) => {
      dispatch({ type: GET_TAGS, payload: data });
    });
  };
};

export const getCommits = (repoOwner, branch, page) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios(
      `${API_URL}/github/repos/${repoOwner}/commits?sha=${branch}&per_page=50&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(({ data }) => {
        dispatch({ type: GET_COMMITS, payload: data });
      })
      .catch(error => {
        console.error(error);
      });
  };
};

export const getCommitData = (repoOwner, sha) => {
  return dispatch => {
    axios(
      `${API_URL}/github/repos/${repoOwner}/git/trees/${sha}?recursive=100`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      },
    ).then(({ data }) => {
      dispatch({ type: GET_COMMIT_DATA, payload: data });
    });
    axios(`${API_URL}/github/repos/${repoOwner}/commits/${sha}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    }).then(({ data }) => {
      dispatch({ type: GET_COMMIT, payload: data });
    });
  };
};
export const getDefaultBranch = repoOwner => {
  const token = Cookies.get('token');
  return dispatch => {
    axios(`${API_URL}/github/repos/${repoOwner}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache',
      },
    }).then(({ data }) => {
      dispatch({ type: GET_DEFAULT_BRANCH, payload: data.default_branch });
    });
  };
};

export const getRepoOwner = repoOwner => {
  return dispatch => {
    dispatch({ type: GET_REPO_OWNER, payload: repoOwner });
  };
};

export const getSha = sha => {
  return dispatch => {
    dispatch({ type: GET_SHA, payload: sha });
  };
};

export const clearRepoOwner = () => {
  return dispatch => {
    dispatch({ type: CLEAR_REPO_OWNER });
  };
};

export const getTotalCommits = (repoOwner, branch) => {
  return dispatch => {
    axios(`${API_URL}/github/repos/${repoOwner}/commits`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        'Cache-Control': 'no-cache',
      },
      params: {
        sha: branch,
        per_page: 50,
        page: 1,
      },
    }).then(data => {
      const linkHeader = data?.headers?.link;
      const lastPage = linkHeader?.match(/&page=(\d+)>; rel="last"/)[1];
      dispatch({
        type: GET_TOTAL_COMMITS,
        payload: lastPage ? parseInt(lastPage) : 1,
      });
    });
  };
};

export const clearCommit = () => {
  return dispatch => {
    dispatch({ type: CLEAR_COMMIT });
  };
};

export const getMyGithub = () => {
  return dispatch => {
    axios(`${API_URL}/github/user/repos?per_page=100&`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        'Cache-Control': 'no-cache',
      },
    })
      .then(({ data }) => {
        dispatch({
          type: GET_MY_GITHUB_REPOSITORIES,
          payload: data.filter(el => el.owner.type === 'User'),
        });
      })
      .catch(error => {
        console.error(error);
      });
  };
};

export const getMyGithubOrgs = () => {
  return dispatch => {
    axios(`${API_URL}/github/user/orgs?per_page=100`, {
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        'Cache-Control': 'no-cache',
      },
    })
      .then(({ data }) => {
        dispatch({
          type: GET_MY_GITHUB_ORGANIZATION,
          payload: data,
        });
        if (!data.message) {
          data?.map(org => {
            axios(`${API_URL}/github/orgs/${org.login}/repos`, {
              headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
              },
            }).then(({ data }) => {
              dispatch({
                type: GET_MY_GITHUB_ORGANIZATION_REPOSITORIES,
                payload: data,
              });
            });
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
};
