import axios from 'axios';
import Cookies from 'js-cookie';
import {
  GET_CUSTOMERS,
  GET_CURRENT_CUSTOMER,
  GET_CUSTOMER,
  UPDATE_CUSTOMER,
} from './types.js';
import { history } from '../../services/history.js';
import createSearchValues from '../../lib/createSearchValues.js';
import { isAuth } from '../../lib/helper.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getCustomer = () => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/my_customer`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_CUSTOMER, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const getCurrentCustomer = id => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/customer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_CURRENT_CUSTOMER, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const getCustomerByLinkId = linkId => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .get(`${API_URL}/customer_by_link_id/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: GET_CURRENT_CUSTOMER, payload: data });
      })
      .catch(error => {
        console.error(error);
      });
  };
};

export const createCustomer = values => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .post(`${API_URL}/customer`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: UPDATE_CUSTOMER, payload: data });
        const link_id = data.link_id || data.user_id;
        history.push({ pathname: `/c/${link_id}` }, { some: true });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const updateCustomer = (values, redirect = true) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(`${API_URL}/my_customer`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: 'UPDATE_CUSTOMER', payload: data });
        if (redirect) {
          const link_id = data.link_id || data.user_id;
          history.push({ pathname: `/c/${link_id}` }, { some: true });
        }
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};

export const searchCustomers = values => {
  const queryString = createSearchValues(values, 'customer');

  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?${queryString}`,
        isAuth() ? { headers: { Authorization: `Bearer ${token}` } } : {},
      )
      .then(({ data }) => {
        dispatch({ type: GET_CUSTOMERS, payload: data });
      })
      .catch(({ response }) => {
        console.error(response, 'res');
      });
  };
};
