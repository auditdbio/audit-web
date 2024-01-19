import axios from 'axios';
import Cookies from 'js-cookie';
import { history } from '../../services/history.js';
import {
  AUTH_TRUE,
  CLEAR_ERROR,
  LOG_OUT,
  SIGN_IN_ERROR,
  USER_IS_ALREADY_EXIST,
  USER_SIGNIN,
  USER_SIGNUP,
  SELECT_ROLE,
  UPDATE_USER,
  CLEAR_SUCCESS,
  CHANGE_ROLE_DONT_HAVE_PROFILE_CUSTOMER,
  CHANGE_ROLE_HAVE_PROFILE_CUSTOMER,
  CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
  CHANGE_ROLE_HAVE_PROFILE_AUDITOR,
  GET_CUSTOMER,
  GET_AUDITOR,
  RESTORE_PASSWORD,
  SEND_EMAIL,
  CONNECT_ACCOUNT,
  CHANGE_ACCOUNT_VISIBILITY,
  ERROR_ADD_ACCOUNT,
  ERROR_IDENTITY,
} from './types.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const signUpGithub = (code, role) => {
  return dispatch => {
    axios
      .post(`${API_URL}/auth/github`, { code, current_role: role })
      .then(({ data }) => {
        Cookies.set('token', data.token, { expires: 1 });
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: USER_SIGNIN, payload: data });
        if (data.user?.is_new) {
          history.push({ pathname: `/edit-profile` }, { some: true });
        } else {
          history.push({ pathname: `/profile/user-info` }, { some: true });
        }

        axios.patch(
          `${API_URL}/user/${data.user?.id}`,
          { is_new: false },
          { headers: { Authorization: `Bearer ${data.token}` } },
        );
      })
      .catch(({ response }) => {
        dispatch({ type: SIGN_IN_ERROR, payload: response.data });
      });
  };
};

export const signIn = values => {
  return dispatch => {
    axios
      .post(`${API_URL}/auth/login`, values)
      .then(({ data }) => {
        Cookies.set('token', data.token, { expires: 1 });
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: USER_SIGNIN, payload: data });

        axios.patch(
          `${API_URL}/user/${data.user?.id}`,
          { is_new: false },
          { headers: { Authorization: `Bearer ${data.token}` } },
        );

        if (data.user?.is_new) {
          history.push({ pathname: `/edit-profile` }, { some: true });
        } else {
          history.push({ pathname: `/profile/user-info` }, { some: true });
        }
      })
      .catch(({ response }) => {
        dispatch({ type: SIGN_IN_ERROR, payload: response.data });
      });
  };
};

export const clearUserError = () => {
  return { type: CLEAR_ERROR };
};

export const clearUserSuccess = () => {
  return { type: CLEAR_SUCCESS };
};

export const signUp = values => {
  return dispatch => {
    axios
      .post(`${API_URL}/user`, values)
      .then(({ data }) => {
        dispatch({ type: USER_SIGNUP, payload: data });
        history.push('/sign-in', {
          some: true,
        });
      })
      .catch(({ response }) => {
        dispatch({ type: USER_IS_ALREADY_EXIST });
      });
  };
};

export const changeAccountVisibility = (user_id, values, account_id) => {
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${user_id}/linked_account/${account_id}`,
        values,
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data }) => {
        dispatch({ type: CHANGE_ACCOUNT_VISIBILITY, payload: data });
        const user = JSON.parse(localStorage.getItem('user'));
        const newData = {
          ...user,
          linked_accounts: user.linked_accounts.map(item => {
            if (item.id === account_id) {
              return data;
            }
            return item;
          }),
        };
        localStorage.setItem('user', JSON.stringify(newData));
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };
};

export const connect_account = (user_id, values) => {
  return dispatch => {
    axios
      .post(`${API_URL}/user/${user_id}/linked_account`, values, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('token'),
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        dispatch({ type: CONNECT_ACCOUNT, payload: data });
        dispatch({ type: CHANGE_ACCOUNT_VISIBILITY, payload: data });
        const user = JSON.parse(localStorage.getItem('user'));
        const newData = {
          ...user,
          linked_accounts: [...user.linked_accounts, data],
        };
        localStorage.setItem('user', JSON.stringify(newData));
        history.push('/profile/user-info', {
          some: true,
        });
      })
      .catch(data => {
        if (data.response.status === 404) {
          dispatch({ type: ERROR_ADD_ACCOUNT, payload: data.response });
        } else {
          dispatch({ type: ERROR_IDENTITY, payload: data.response });
        }
        history.push('/profile/user-info', {
          some: true,
        });
      });
  };
};

export const restorePassword = values => {
  return dispatch => {
    axios
      .post(`${API_URL}/auth/reset_password`, values)
      .then(({ data }) => {
        dispatch({ type: RESTORE_PASSWORD, payload: data });
        history.push('/sign-in', {
          some: true,
        });
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export const sendRestoreMessage = values => {
  return dispatch => {
    axios
      .get(`${API_URL}/auth/forgot_password/${values.email}`)
      .then(({ data }) => {
        dispatch({ type: SEND_EMAIL, payload: data });
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export const authenticate = () => {
  return { type: AUTH_TRUE };
};

export const logout = () => {
  history.push('/');
  Cookies.remove('token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { type: LOG_OUT };
};

export const changeRole = (value, id) => {
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: value },
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data }) => {
        dispatch({ type: SELECT_ROLE, payload: data });
        localStorage.setItem('user', JSON.stringify(data));
        history.push(
          { pathname: `/profile/user-info` },
          {
            some: true,
          },
        );
      });
  };
};

export const changeRolePublicCustomer = (value, id, currentRole) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: value },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data: user }) => {
        axios
          .get(`${API_URL}/my_customer`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(({ data: customer }) => {
            dispatch({ type: GET_CUSTOMER, payload: customer });
            return { customer, user };
          })
          .then(({ customer, user }) => {
            if (customer?.first_name || customer?.last_name) {
              dispatch({
                type: CHANGE_ROLE_HAVE_PROFILE_CUSTOMER,
                payload: user,
              });
            } else {
              dispatch({
                type: CHANGE_ROLE_DONT_HAVE_PROFILE_CUSTOMER,
                payload: user,
              });
              history.push({ pathname: `/profile/user-info` }, { some: true });
            }
            localStorage.setItem('user', JSON.stringify(user));
          });
      });
  };
};

export const changeRolePublicAuditor = (value, id, currentRole) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: value },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data: user }) => {
        axios
          .get(`${API_URL}/my_auditor`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(({ data: auditor }) => {
            dispatch({ type: GET_AUDITOR, payload: auditor });
            return { auditor, user };
          })
          .then(({ auditor, user }) => {
            if (auditor?.first_name || auditor?.last_name) {
              dispatch({
                type: CHANGE_ROLE_HAVE_PROFILE_AUDITOR,
                payload: user,
              });
            } else {
              dispatch({
                type: CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
                payload: user,
              });
              history.push({ pathname: `/profile/user-info` }, { some: true });
            }
            localStorage.setItem('user', JSON.stringify(user));
          });
      });
  };
};

export const changeRolePublicAuditorNoRedirect = (value, id, currentRole) => {
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: value },
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data }) => {
        dispatch({ type: SELECT_ROLE, payload: data });
        localStorage.setItem('user', JSON.stringify(data));
      });
  };
};

export const changeRolePublicCustomerNoRedirect = (value, id, currentRole) => {
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: value },
        {
          headers: {
            Authorization: 'Bearer ' + Cookies.get('token'),
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data }) => {
        dispatch({ type: SELECT_ROLE, payload: data });
        localStorage.setItem('user', JSON.stringify(data));
      });
  };
};

export const changePassword = (values, userId) => {
  return dispatch => {
    axios
      .patch(`${API_URL}/user/${userId}`, values, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('token'),
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        dispatch({ type: UPDATE_USER, payload: data });
      })
      .catch(({ response }) => {
        dispatch({ type: SIGN_IN_ERROR, payload: response.data });
      });
  };
};
