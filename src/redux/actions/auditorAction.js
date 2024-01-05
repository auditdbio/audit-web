import Cookies from 'js-cookie';
import axios from 'axios';
import {
  DELETE_BADGE,
  GET_AUDITOR,
  GET_AUDITORS,
  GET_CURRENT_AUDITOR,
  MERGE_ACCOUNT,
  SEARCH_AUDITOR,
  SEARCH_PROJECTS,
  SIGN_IN_ERROR,
  UPDATE_AUDITOR,
  USER_SIGNIN,
} from './types.js';
import { history } from '../../services/history.js';
import dayjs from 'dayjs';
import { isAuth } from '../../lib/helper.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuditor = values => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/my_auditor`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_AUDITOR, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const getCurrentAuditor = id => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/auditor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_CURRENT_AUDITOR, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const createAuditor = values => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .post(`${API_URL}/auditor`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: UPDATE_AUDITOR, payload: data });
        history.push(
          { pathname: `/profile/user-info` },
          {
            some: true,
          },
        );
      })
      .catch(({ response }) => {
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const updateAuditor = (values, redirect = true) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(`${API_URL}/my_auditor`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: UPDATE_AUDITOR, payload: data });
        if (redirect) {
          history.push({ pathname: `/profile/user-info` }, { some: true });
        }
      })
      .catch(({ response }) => {
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const getAuditors = (values = '', amount) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?query=${values}&sort_by=price&tags=&sort_order=1&page=1&per_page=${
          amount ? amount : 0
        }&kind=auditor badge`,
        isAuth()
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : {},
      )
      .then(({ data }) => {
        dispatch({ type: GET_AUDITORS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const searchAuditor = values => {
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
    `kind=auditor badge`,
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
        dispatch({ type: GET_AUDITORS, payload: data });
      })
      .catch(({ response }) => {
        console.error(response, 'res');
      });
  };
};

export const deleteBadgeProfile = id => {
  return dispatch => {
    axios
      .delete(`${API_URL}/badge/delete/${id}`)
      .then(({ data }) => {
        dispatch({ type: DELETE_BADGE, payload: data });
        history.push(
          { pathname: `/` },
          {
            some: true,
          },
        );
      })
      .catch(({ response }) => {
        console.error(response, 'res');
      });
  };
};

export const mergeCurrentAccount = (auditor, secret) => {
  const token = Cookies.get('token');

  return dispatch => {
    axios
      .patch(`${API_URL}/badge/merge/${secret}`, auditor, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: MERGE_ACCOUNT, payload: data.user });
        history.push(
          { pathname: `/profile/user-info` },
          {
            some: true,
          },
        );
      })
      .catch(({ response }) => {
        console.error(response, 'res');
      });
  };
};

export const mergeAccount = (values, secret) => {
  return dispatch => {
    axios
      .post(`${API_URL}/auth/login`, values)
      .then(({ data }) => {
        axios
          .patch(`${API_URL}/badge/merge/${secret}`, data.user, {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
          .then(({ data }) => {
            dispatch({ type: MERGE_ACCOUNT, payload: data });
            history.push(
              { pathname: `/profile/user-info` },
              {
                some: true,
              },
            );
          })
          .catch(({ response }) => {
            console.error(response, 'res');
          });
      })
      .catch(({ response }) => {
        dispatch({ type: SIGN_IN_ERROR, payload: response.data });
      });
  };
};
