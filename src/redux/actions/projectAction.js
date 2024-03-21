import {
  CLEAR_SUCCESS,
  CLOSE_THE_PROJECT,
  GET_CLOC,
  CLEAR_CLOC,
  GET_CURRENT_PROJECT,
  GET_MY_PROJECTS,
  GET_PROJECTS,
  NOT_FOUND,
  PROJECT_CREATE,
  PROJECT_UPDATE,
  PROJECT_UPDATE_STATUS,
  SEARCH_PROJECTS,
} from './types.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { history } from '../../services/history.js';
import createSearchValues from '../../lib/createSearchValues.js';
import { isAuth } from '../../lib/helper.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createProject = values => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .post(`${API_URL}/project`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: PROJECT_CREATE, payload: data });
        history.push('/profile/projects');
      })
      .catch(e => {
        console.log(e, 'res');
      });
  };
};

export const createProjectNoRedirect = values => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .post(`${API_URL}/project`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        localStorage.setItem('project', JSON.stringify(data));
        dispatch({ type: PROJECT_CREATE, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const editProject = values => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .patch(`${API_URL}/project/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: PROJECT_UPDATE, payload: data });
        history.push('/profile/projects', {
          some: true,
        });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const editProjectNoRedirect = values => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .patch(`${API_URL}/project/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        localStorage.setItem('project', JSON.stringify(data));
        dispatch({ type: PROJECT_UPDATE, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const changeStatusProject = values => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .patch(`${API_URL}/project/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: PROJECT_UPDATE_STATUS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const closeProject = values => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .patch(`${API_URL}/project/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: CLOSE_THE_PROJECT, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const clearProjectMessage = () => {
  return { type: CLEAR_SUCCESS };
};

export const getAllProjects = (values = '', amount) => {
  return async dispatch => {
    const token = Cookies.get('token');
    await axios
      .get(
        `${API_URL}/search?query=${values}&tags=&sort_by=price&sort_order=1&page=1&per_page=${
          amount ? amount : 0
        }&kind=project`,
        isAuth()
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {},
      )
      .then(({ data }) => {
        dispatch({ type: GET_PROJECTS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const getProjects = () => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/my_project`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_MY_PROJECTS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const getProjectById = id => {
  return dispatch => {
    axios
      .get(`${API_URL}/project/${id}`)
      .then(({ data }) =>
        dispatch({ type: GET_CURRENT_PROJECT, payload: data }),
      )
      .catch(({ response }) => {
        if (response?.status === 403) dispatch({ type: NOT_FOUND });
      });
  };
};

export const searchProjects = values => {
  const queryString = createSearchValues(values, 'project');

  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?${queryString}`,
        isAuth() ? { headers: { Authorization: `Bearer ${token}` } } : {},
      )
      .then(({ data }) => {
        dispatch({ type: SEARCH_PROJECTS, payload: data });
      })
      .catch(({ response }) => {
        console.error(response, 'res');
      });
  };
};

export const getCloc = links => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .post(`${API_URL}/cloc/count`, links, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        delete data.header;
        dispatch({ type: GET_CLOC, payload: data });
      });
  };
};

export const clearCloc = () => {
  return { type: CLEAR_CLOC };
};
