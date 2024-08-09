import Cookies from 'js-cookie';
import axios from 'axios';
import {
  ACCEPT_INVITE,
  ADD_MEMBER_IN_ORGANIZATION,
  CLEAR_ORGANIZATION,
  CREATE_ORGANIZATION,
  DELETE_INVITES,
  GET_MY_ORGANIZATION,
  GET_ORGANIZATION_AUDIT_REQUESTS,
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
          history.push({ pathname: `/o/${navigateTo}` }, { some: true });
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
      .get(`${API_URL}/organization/link_id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: GET_ORGANIZATION_BY_ID, payload: data });
      });
  };
};

export const addUserInOrganization = (orgLinkId, data, id) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .post(`${API_URL}/organization/${id}/members`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(getOrganizationById(orgLinkId));
      });
  };
};
//
export const deleteUserFromOrganization = (orgId, userId) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .delete(`${API_URL}/organization/${orgId}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(getOrganizationById(orgId));
      });
  };
};

export const acceptInvites = org_id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .post(
        `${API_URL}/organization/${org_id}/invites/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        dispatch({ type: ACCEPT_INVITE, payload: data });
      });
  };
};

export const getAuditRequests = org_id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/audit_request/organization/${org_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: GET_ORGANIZATION_AUDIT_REQUESTS, payload: data });
      });
  };
};

export const deleteInvites = (org_id, user_id) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .delete(`${API_URL}/organization/${org_id}/invites/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: DELETE_INVITES, payload: { ...data, id: org_id } });
      });
    // dispatch({ type: 'CHECK_INVITES', payload: data });
  };
};
