import Cookies from 'js-cookie';
import axios from 'axios';
import {
  CLEAR_ORGANIZATION,
  CREATE_ORGANIZATION,
  GET_MY_ORGANIZATION,
  GET_ORGANIZATION_BY_ID,
  UPDATE_ORGANIZATION,
} from './types.js';
import { history } from '../../services/history.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createOrganization = (value, navigateTo) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .post(`${API_URL}/organization`, value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: CREATE_ORGANIZATION, payload: data });
        if (navigateTo) {
          history.push({ pathname: navigateTo }, { some: true });
        }
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const updateOrganization = (value, navigateTo) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/organization/${value.id}`, value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: UPDATE_ORGANIZATION, payload: data });
        if (navigateTo) {
          history.push({ pathname: navigateTo }, { some: true });
        }
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const clearOrganization = () => {
  return dispatch => {
    dispatch({ type: CLEAR_ORGANIZATION });
  };
};

export const getMyOrganizations = () => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/my_organizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: GET_MY_ORGANIZATION, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
      });
  };
};

export const getOrganizationById = id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/organization/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        console.log(data);
        dispatch({ type: GET_ORGANIZATION_BY_ID, payload: data });
      });
  };
};
