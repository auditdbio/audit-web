import axios from 'axios';
import {
  CLEAR_MESSAGES,
  ERROR_CONTACT_MESSAGE,
  SEND_CONTACT_MESSAGE,
} from './types.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const sendContactMessage = values => {
  return dispatch => {
    axios
      .post(`${API_URL}/feedback`, values)
      .then(({ data }) => {
        console.log(data);
        dispatch({ type: SEND_CONTACT_MESSAGE, payload: data });
      })
      .catch(error => {
        dispatch({ type: ERROR_CONTACT_MESSAGE });
        console.log(error);
      });
  };
};

export const clearFormMessage = () => {
  return { type: CLEAR_MESSAGES };
};
