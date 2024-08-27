import Cookies from 'js-cookie';
import axios from 'axios';
import {
  AUDITOR_SET_ERROR,
  CLEAR_CURRENT_AUDITOR_CUSTOMER,
  DELETE_BADGE,
  GET_AUDITOR,
  GET_AUDITOR_RATING_DETAILS,
  GET_AUDITORS,
  GET_CURRENT_AUDITOR,
  GET_PUBLIC_PROFILE,
  MERGE_ACCOUNT,
  SIGN_IN_ERROR,
  UPDATE_AUDITOR,
} from './types.js';
import { history } from '../../services/history.js';
import createSearchValues from '../../lib/createSearchValues.js';
import { isAuth } from '../../lib/helper.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuditor = (redirect = false) => {
  const token = Cookies.get('token');
  return (dispatch, getState) => {
    axios
      .get(`${API_URL}/my_auditor`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_AUDITOR, payload: data });

        if (redirect) {
          const { user } = getState();
          history.push(
            { pathname: `/a/${data.link_id || user.user?.id}` },
            { some: true },
          );
        }
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

export const getAuditorByLinkId = (linkId, notFoundRedirect = true) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/auditor_by_link_id/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_CURRENT_AUDITOR, payload: data });
        axios.get(`${API_URL}/user/${data.user_id}`).then(({ data: user }) => {
          dispatch({ type: GET_PUBLIC_PROFILE, payload: user });
        });
      })
      .catch(({ response }) => {
        if (notFoundRedirect) {
          console.error(response?.data);
          history.push('/not-found');
        }
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
        dispatch({
          type: UPDATE_AUDITOR,
          payload: {
            auditor: data,
            message: 'Success! Your auditor profile has been created',
          },
        });
        const link_id = data.link_id || data.user_id;
        history.push({ pathname: `/a/${link_id}` }, { some: true });
      })
      .catch(({ response }) => {
        console.error(response);
        dispatch({
          type: AUDITOR_SET_ERROR,
          payload: response?.data || 'Error creating auditor profile',
        });
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
        dispatch({
          type: UPDATE_AUDITOR,
          payload: {
            auditor: data,
            message: 'Success! Your auditor profile has been changed',
          },
        });
        if (redirect) {
          const link_id = data.link_id || data.user_id;
          history.push({ pathname: `/a/${link_id}` }, { some: true });
        }
      })
      .catch(({ response }) => {
        console.error(response);
        dispatch({
          type: AUDITOR_SET_ERROR,
          payload: response?.data || 'Auditor profile update error',
        });
      });
  };
};

export const getAuditors = (values = '', amount = 0) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?query=${values}&sort_by=price&tags=&sort_order=1&page=1&per_page=${amount}&kind=auditor badge`,
        isAuth() ? { headers: { Authorization: `Bearer ${token}` } } : {},
      )
      .then(({ data }) => {
        dispatch({ type: GET_AUDITORS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const getAuditorById = id => {
  return dispatch => {
    axios
      .get(`${API_URL}/auditor/${id}`)
      .then(({ data }) => {
        dispatch({ type: GET_CURRENT_AUDITOR, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const getAuditorRating = (id, getDetails = false) => {
  return dispatch => {
    let url = getDetails
      ? `${API_URL}/rating/auditor/${id}/details`
      : `${API_URL}/rating/auditor/${id}`;

    axios.get(url).then(({ data }) => {
      dispatch({ type: GET_AUDITOR_RATING_DETAILS, payload: data });
    });
  };
};

export const searchAuditor = (values, badges = true) => {
  const kind = badges ? 'auditor badge' : 'auditor';
  const queryString = createSearchValues(values, kind);

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
        history.push({ pathname: `/` }, { some: true });
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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: MERGE_ACCOUNT, payload: data.user });
        history.push({ pathname: `/profile/user-info` }, { some: true });
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
            headers: { Authorization: `Bearer ${data.token}` },
          })
          .then(({ data }) => {
            dispatch({ type: MERGE_ACCOUNT, payload: data });
            history.push({ pathname: `/profile/user-info` }, { some: true });
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

export const clearCurrentAuditor = () => {
  return { type: CLEAR_CURRENT_AUDITOR_CUSTOMER };
};
