import Cookies from 'js-cookie';
import axios from 'axios';
import {
  DELETE_BADGE,
  GET_AUDITOR,
  GET_AUDITORS,
  GET_CURRENT_AUDITOR,
  MERGE_ACCOUNT,
  SIGN_IN_ERROR,
  UPDATE_AUDITOR,
} from './types.js';
import { history } from '../../services/history.js';
import createSearchValues from '../../lib/createSearchValues.js';
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

export const updateAuditor = values => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(`${API_URL}/my_auditor`, values, {
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
  const queryString = createSearchValues(values, 'auditor badge');

  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?${queryString}`,
        isAuth() ? { headers: { Authorization: `Bearer ${token}` } } : {},
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
