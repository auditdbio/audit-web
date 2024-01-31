import {
  CLEAR_COMMIT,
  CLEAR_REPO_OWNER,
  GET_BRANCHES,
  GET_COMMIT,
  GET_COMMIT_DATA,
  GET_COMMITS,
  GET_DEFAULT_BRANCH,
  GET_MY_GITHUB_REPOSITORIES,
  GET_REPO_OWNER,
  GET_TOTAL_COMMITS,
} from './types.js';
import axios from 'axios';

export const getBranches = repoOwner => {
  return async dispatch => {
    try {
      let allBranches = [];
      let page = 1;
      let perPage = 100;

      while (true) {
        const response = await fetch(
          `https://api.github.com/repos/${repoOwner}/branches?per_page=${perPage}&page=${page}`,
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

export const getCommits = (repoOwner, branch, page) => {
  return dispatch => {
    axios(
      `https://api.github.com/repos/${repoOwner}/commits?sha=${branch}&per_page=100&page=${page}`,
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
      `https://api.github.com/repos/${repoOwner}/git/trees/${sha}?recursive=100`,
    ).then(({ data }) => {
      dispatch({ type: GET_COMMIT_DATA, payload: data });
    });
    axios(`https://api.github.com/repos/${repoOwner}/commits/${sha}`).then(
      ({ data }) => {
        dispatch({ type: GET_COMMIT, payload: data });
      },
    );
  };
};
export const getDefaultBranch = repoOwner => {
  return dispatch => {
    axios(`https://api.github.com/repos/${repoOwner}`).then(({ data }) => {
      console.log(repoOwner);
      dispatch({ type: GET_DEFAULT_BRANCH, payload: data.default_branch });
    });
  };
};

export const getRepoOwner = repoOwner => {
  return dispatch => {
    dispatch({ type: GET_REPO_OWNER, payload: repoOwner });
  };
};

export const clearRepoOwner = () => {
  return dispatch => {
    dispatch({ type: CLEAR_REPO_OWNER });
  };
};

export const getTotalCommits = (repoOwner, branch) => {
  return async dispatch => {
    try {
      let pageCount = 1;
      let totalCount = 0;

      while (true) {
        const response = await axios.get(
          `https://api.github.com/repos/${repoOwner}/commits`,
          {
            params: {
              sha: branch,
              per_page: 100,
              page: pageCount,
            },
          },
        );
        const linkHeader = response.headers.link;
        if (!linkHeader || !linkHeader.includes('rel="last"')) {
          totalCount += response.data.length;
          break;
        }

        const matches = linkHeader.match(/&page=(\d+)>; rel="last"/);
        const lastPage = matches ? parseInt(matches[1]) : 1;

        if (pageCount >= lastPage) {
          totalCount += response.data.length;
          break;
        }

        totalCount += response.data.length;
        pageCount++;
      }
      dispatch({
        type: GET_TOTAL_COMMITS,
        payload: Math.floor(totalCount / 100) + 1,
      });
    } catch (error) {
      console.error('Error fetching commits:', error);
    }
  };
};

export const clearCommit = () => {
  return dispatch => {
    dispatch({ type: CLEAR_COMMIT });
  };
};

export const getMyGithub = user => {
  return dispatch => {
    axios(`https://api.github.com/users/${user}/repos?per_page=100`)
      .then(({ data }) => {
        dispatch({ type: GET_MY_GITHUB_REPOSITORIES, payload: data });
      })
      .catch(error => {
        console.error(error);
      });
  };
};
