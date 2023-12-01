import axios from 'axios';
import Cookies from 'js-cookie';
import {
  GET_CURRENT_AUDITOR,
  GET_CURRENT_CUSTOMER,
  GET_CUSTOMER,
  SIGN_IN_ERROR,
  UPDATE_CUSTOMER,
  USER_SIGNIN,
} from './types.js';
import { history } from '../../services/history.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getCustomer = values => {
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

export const createCustomer = values => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .post(`${API_URL}/customer`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: UPDATE_CUSTOMER, payload: data });
        history.push(
          { pathname: `/profile/user-info` },
          {
            some: true,
          },
        );
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
          history.push({ pathname: `/profile/user-info` }, { some: true });
        }
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        // dispatch({type: SIGN_IN_ERROR})
      });
  };
};
