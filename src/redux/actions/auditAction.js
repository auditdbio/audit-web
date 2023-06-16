import Cookies from 'js-cookie';
import axios from 'axios';
import {
  AUDIT_REQUEST_CREATE,
  AUDITOR,
  CLEAR_MESSAGES,
  CONFIRM_AUDIT,
  CUSTOMER,
  DELETE_AUDIT,
  DELETE_REQUEST,
  GET_AUDIT_REQUEST,
  GET_AUDITS,
  IN_PROGRESS,
  REQUEST_ERROR,
  SET_CURRENT_AUDIT_PARTNER,
} from './types.js';
import { history } from '../../services/history.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createRequest = (values, redirect, navigateTo) => {
  return dispatch => {
    const token = Cookies.get('token');
    const current_role = JSON.parse(localStorage.getItem('user')).current_role;
    axios
      .post(
        `${API_URL}/audit_request`,
        {
          ...values,
          time: {
            from: +new Date(values.time.from),
            to: +new Date(values.time.to),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        dispatch(getAuditsRequest(current_role));
        if (!redirect) {
          history.back();
        } else if (navigateTo) {
          history.push(navigateTo);
        }
        dispatch({ type: AUDIT_REQUEST_CREATE, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, 'res');
        dispatch({ type: REQUEST_ERROR });
      });
  };
};

export const getAuditsRequest = role => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/my_audit_request/${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: GET_AUDIT_REQUEST, payload: data });
        // history.push("/home-customer", {
        //     some: true
        // });
      });
  };
};

export const getAudits = role => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/my_audit/${role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: GET_AUDITS, payload: data });
        // history.push("/home-customer", {
        //     some: true
        // });
      });
  };
};

export const deleteAuditRequest = id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .delete(`${API_URL}/audit_request/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: DELETE_REQUEST, payload: data });
        history.back();
      });
  };
};

export const deleteAudit = id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .delete(`${API_URL}/audit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        history.back();
        dispatch({ type: DELETE_AUDIT, payload: data });
      });
  };
};

export const addReportAudit = values => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/audit/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        history.back();
        dispatch(getAudits(AUDITOR));
      });
  };
};

export const acceptAudit = values => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/audit/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        history.back();
        dispatch(getAudits(CUSTOMER));
      });
  };
};

export const confirmAudit = values => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .post(`${API_URL}/audit`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        history.back();
        dispatch({ type: CONFIRM_AUDIT, payload: data });
      });
  };
};

export const startAudit = (values, goBack) => {
  const newValue = { ...values, start_audit: true };
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/audit/${values.id}`, newValue, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: IN_PROGRESS, payload: data });
        if (goBack) {
          history.back();
        }
      });
  };
};

export const setCurrentAuditPartner = audit => {
  return (dispatch, getState) => {
    const state = getState();
    const { user } = state.user;
    const { currentAuditPartner } = state.audits;

    if (
      currentAuditPartner?.user_id === audit?.customer_id ||
      currentAuditPartner?.user_id === audit?.auditor_id
    ) {
      return;
    }

    if (audit && user?.id === audit?.auditor_id) {
      axios
        .get(`${API_URL}/customer/${audit?.customer_id}`)
        .then(({ data }) => {
          dispatch({ type: SET_CURRENT_AUDIT_PARTNER, payload: data });
        });
    } else if (audit && user?.id === audit?.customer_id) {
      axios.get(`${API_URL}/auditor/${audit?.auditor_id}`).then(({ data }) => {
        dispatch({ type: SET_CURRENT_AUDIT_PARTNER, payload: data });
      });
    }
  };
};

export const clearMessage = () => {
  return { type: CLEAR_MESSAGES };
};
