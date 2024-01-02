import {
  CLEAR_SUCCESS,
  CLOSE_THE_PROJECT,
  GET_CURRENT_PROJECT,
  GET_MY_PROJECT,
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
import dayjs from 'dayjs';
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
        // history.push("/profile/projects", {
        //     some: true,
        // });
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

export const getProjects = page => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/my_project?page=${page || 1}&per_page=12`, {
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

export const getMyProject = id => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/project/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => dispatch({ type: GET_MY_PROJECT, payload: data }))
      .catch(({ response }) => {
        if (response?.status === 403) dispatch({ type: NOT_FOUND });
      });
  };
};

export const searchProjects = values => {
  const searchValues = {
    query: values?.search || '',
    tags: values?.tags || '',
    ready_to_wait: values?.ready_to_wait || '',
    dateFrom:
      +new Date() + 60000 < +new Date(values?.dateFrom)
        ? dayjs().valueOf(values?.dateFrom)
        : '',
    dateTo:
      +new Date() + 60000 < +new Date(values?.dateTo)
        ? dayjs().valueOf(values?.dateTo)
        : '',
    priceFrom: parseInt(values?.price.from) || '',
    priceTo: parseInt(values?.price.to) || '',
    sort: values?.sort || 1,
    page: values?.page || 0,
  };

  const queryParams = [
    `query=${searchValues.query}`,
    `tags=${searchValues.tags?.join(' ')}`,
    `sort_order=${searchValues.sort}`,
    `page=${searchValues.page}`,
    `sort_by=price`,
    `per_page=10`,
    `kind=project`,
  ];

  if (searchValues.ready_to_wait) {
    queryParams.push(`ready_to_wait=${searchValues.ready_to_wait}`);
  }
  if (searchValues.priceFrom) {
    queryParams.push(`price_from=${searchValues.priceFrom}`);
  }
  if (searchValues.priceTo) {
    queryParams.push(`price_to=${searchValues.priceTo}`);
  }
  if (searchValues.dateFrom) {
    queryParams.push(`date_from=${searchValues.dateFrom}`);
  }
  if (searchValues.dateTo) {
    queryParams.push(`date_to=${searchValues.dateTo}`);
  }

  const queryString = queryParams.join('&');

  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?${queryString}`,
        isAuth()
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {},
      )
      .then(({ data }) => {
        dispatch({ type: SEARCH_PROJECTS, payload: data });
      })
      .catch(({ response }) => {
        console.error(response, 'res');
      });
  };
};
