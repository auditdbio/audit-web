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
  DELETE_LINKED_ACCOUNT,
  GET_PROFILE,
  GET_PUBLIC_PROFILE,
  GET_MY_PROFILE,
  CLEAR_MESSAGES,
  AUDITOR,
  CUSTOMER,
  GET_AUDITS,
} from './types.js';
import { getAudits, savePublicReport } from './auditAction.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const signUpGithub = data => {
  return async dispatch => {
    try {
      const { data: responseData } = await axios.post(
        `${API_URL}/auth/github`,
        data,
      );

      if (responseData.user?.is_new) {
        await axios.patch(
          `${API_URL}/user/${responseData.user?.id}`,
          { is_new: false },
          { headers: { Authorization: `Bearer ${responseData.token}` } },
        );
        Cookies.set('token', responseData.token, { expires: 1 });
        localStorage.setItem('token', JSON.stringify(responseData.token));
        localStorage.setItem('user', JSON.stringify(responseData.user));
        dispatch({ type: USER_SIGNIN, payload: responseData });
        history.push({ pathname: `/edit-profile` }, { some: true });
      } else {
        const rolePrefix = responseData.user?.current_role?.[0];
        const { data: auditData } = await axios.get(
          `${API_URL}/my_audit/${rolePrefix === 'c' ? 'customer' : 'auditor'}`,
          {
            headers: {
              Authorization: `Bearer ${responseData.token}`,
            },
          },
        );
        Cookies.set('token', responseData.token, { expires: 1 });
        localStorage.setItem('token', JSON.stringify(responseData.token));
        localStorage.setItem('user', JSON.stringify(responseData.user));
        dispatch({ type: USER_SIGNIN, payload: responseData });
        history.push(
          {
            pathname: auditData.length
              ? `profile/audits`
              : `/${rolePrefix}/${data.user.id}`,
          },
          { some: true },
        );
      }
    } catch (error) {
      const { response } = error;
      dispatch({ type: SIGN_IN_ERROR, payload: 'Sign In Failed' });
    }
  };
};

//

export const signIn = values => {
  return async (dispatch, getState) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, values);

      if (data.user?.is_new) {
        await axios.patch(
          `${API_URL}/user/${data.user?.id}`,
          { is_new: false },
          { headers: { Authorization: `Bearer ${data.token}` } },
        );
        Cookies.set('token', data.token, { expires: 1 });
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: USER_SIGNIN, payload: data });
        history.push({ pathname: `/edit-profile` }, { some: true });
      } else {
        const role = data.user?.current_role?.[0];
        const { data: auditData } = await axios.get(
          `${API_URL}/my_audit/${role === 'c' ? 'customer' : 'auditor'}`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          },
        );
        Cookies.set('token', data.token, { expires: 1 });
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: USER_SIGNIN, payload: data });
        history.push(
          {
            pathname: auditData.length
              ? `profile/audits`
              : `/${role}/${data.user.id}`,
          },
          { some: true },
        );
      }
    } catch (error) {
      const { response } = error;
      dispatch({ type: SIGN_IN_ERROR, payload: response.data });
    }
  };
};

export const clearUserError = () => {
  return { type: CLEAR_ERROR };
};

export const clearUserSuccess = () => {
  return { type: CLEAR_SUCCESS };
};

export const clearUserMessages = () => {
  return { type: CLEAR_MESSAGES };
};

export const getMyProfile = id => {
  return dispatch => {
    axios(`${API_URL}/my_user`, {
      headers: {
        Authorization: 'Bearer ' + Cookies.get('token'),
      },
    })
      .then(({ data }) => {
        dispatch({ type: GET_MY_PROFILE, payload: data });
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(data => {
        console.log(data);
      });
  };
};

export const getPublicProfile = id => {
  return dispatch => {
    axios.get(`${API_URL}/user/${id}`).then(({ data }) => {
      dispatch({ type: GET_PUBLIC_PROFILE, payload: data });
    });
  };
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
      .catch(() => {
        dispatch({ type: USER_IS_ALREADY_EXIST });
      });
  };
};

export const handleDeleteLinkedAccount = (user_id, account_id) => {
  return dispatch => {
    axios
      .delete(`${API_URL}/user/${user_id}/linked_account/${account_id}`, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('token'),
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        dispatch(getMyProfile(user_id));
        dispatch({ type: DELETE_LINKED_ACCOUNT, payload: data });
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

export const connect_account = (user_id, values, isWallet = false) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const url = isWallet
    ? `${API_URL}/user/${user_id}/wallet`
    : `${API_URL}/user/${user_id}/linked_account`;

  return (dispatch, getState) => {
    axios
      .post(url, values, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('token'),
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        dispatch({ type: CONNECT_ACCOUNT, payload: data });
        dispatch({ type: CHANGE_ACCOUNT_VISIBILITY, payload: data });
        const newData = {
          ...user,
          linked_accounts: [...user.linked_accounts, data],
        };
        localStorage.setItem('user', JSON.stringify(newData));
      })
      .catch(data => {
        if (data.response.status === 404) {
          dispatch({ type: ERROR_ADD_ACCOUNT, payload: data.response });
        } else {
          dispatch({ type: ERROR_IDENTITY, payload: data.response });
        }
      })
      .finally(() => {
        const rolePrefix = user?.current_role?.[0];
        const { auditor, customer } = getState();
        let linkId = user.id;
        if (user.current_role === AUDITOR) {
          linkId = auditor.auditor?.link_id || user.id;
        } else if (user.current_role === CUSTOMER) {
          linkId = customer.customer?.link_id || user.id;
        }
        history.push(`/${rolePrefix}/${linkId}`, { some: true });
      });
  };
};

export const connect_auth_account = (user_id, values) => {
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
        const user = JSON.parse(localStorage.getItem('user'));
        const newData = {
          ...user,
          linked_accounts: [...user.linked_accounts, data],
        };
        localStorage.setItem('user', JSON.stringify(newData));
        localStorage.setItem('authenticated', 'true');
        window.close();
      })
      .catch(data => {
        if (data.response.status === 404) {
          dispatch({ type: ERROR_ADD_ACCOUNT, payload: data.response });
        } else {
          dispatch({ type: ERROR_IDENTITY, payload: data.response });
        }
        window.close();
      });
  };
};

export const authGithub = (user_id, values) => {
  return dispatch => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios
      .post(`${API_URL}/auth/github`, values)
      .then(({ data }) => {
        if (user.linked_accounts.find(el => el.name === 'GitHub')) {
          localStorage.setItem('token', JSON.stringify(data.token));
          localStorage.setItem('user', JSON.stringify(data.user));
          dispatch({ type: USER_SIGNIN, payload: data });
          localStorage.setItem('authenticated', 'true');
          window.close();
        }
      })
      .catch(data => {
        if (data.response.status === 404) {
          dispatch({ type: ERROR_ADD_ACCOUNT, payload: data.response });
        } else {
          dispatch({ type: ERROR_IDENTITY, payload: data.response });
        }
        const rolePrefix = user?.current_role?.[0];
        history.push(`/${rolePrefix}/${user.id}`, { some: true });
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

export const changeRole = (role, id) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: role },
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(({ data: user }) => {
        dispatch({ type: SELECT_ROLE, payload: user });
        localStorage.setItem('user', JSON.stringify(user));

        if (user.is_new) {
          axios.patch(
            `${API_URL}/user/${user.id}`,
            { is_new: false },
            { headers: { Authorization: `Bearer ${token}` } },
          );
          history.push({ pathname: `/edit-profile` }, { some: true });
        } else {
          history.push({ pathname: `/${role[0]}/${user.id}` }, { some: true });
        }
      });
  };
};

export const changeRolePublicCustomer = (role, id) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: role },
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
              const linkId = customer?.link_id || id;
              history.push(
                { pathname: `/${role[0]}/${linkId}` },
                { some: true },
              );
            }
            localStorage.setItem('user', JSON.stringify(user));
          });
      });
  };
};

export const changeRolePublicAuditor = (role, id, data, withData) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: role },
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
              if (withData) {
                const newData = {
                  auditor_id: auditor.user_id,
                  auditor_first_name: auditor.first_name,
                  auditor_last_name: auditor.last_name,
                  auditor_contacts: auditor.contacts,
                  avatar: auditor.avatar,
                  ...data,
                };
                dispatch(savePublicReport(newData));
              }
            } else {
              dispatch({
                type: CHANGE_ROLE_DONT_HAVE_PROFILE_AUDITOR,
                payload: user,
              });
              const linkId = auditor?.link_id || id;
              history.push(
                { pathname: `/${role[0]}/${linkId}` },
                { some: true },
              );
            }
            localStorage.setItem('user', JSON.stringify(user));
          });
      });
  };
};

export const changeRolePublicAuditorNoRedirect = (role, id) => {
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: role },
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

export const changeRolePublicCustomerNoRedirect = (role, id) => {
  return dispatch => {
    axios
      .patch(
        `${API_URL}/user/${id}`,
        { current_role: role },
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
