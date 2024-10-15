import Cookies from 'js-cookie';
import axios from 'axios';
import {
  ACCEPT_INVITE,
  ADD_MEMBER_IN_ORGANIZATION,
  CLEAR_ORGANIZATION,
  CREATE_ORGANIZATION,
  DELETE_INVITES,
  GET_AUDITORS,
  GET_MY_ORGANIZATION,
  GET_ORGANIZATION_AUDIT_REQUESTS,
  GET_ORGANIZATION_BY_ID,
  GET_ORGANIZATIONS,
  NOT_FOUND_ORGANIZATION,
  UPDATE_ORGANIZATION,
} from './types.js';
import { history } from '../../services/history.js';
import createSearchValues from '../../lib/createSearchValues.js';
import { isAuth } from '../../lib/helper.js';

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
          history.push({ pathname: `/o/${data.link_id}` }, { some: true });
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

export const searchOrganization = (values, badges = true) => {
  const queryString = createSearchValues(values, 'Organization');

  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(
        `${API_URL}/search?${queryString}`,
        isAuth() ? { headers: { Authorization: `Bearer ${token}` } } : {},
      )
      .then(({ data }) => {
        dispatch({ type: GET_ORGANIZATIONS, payload: data });
      })
      .catch(({ response }) => {
        console.error(response, 'res');
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
      })
      .catch(e => dispatch({ type: NOT_FOUND_ORGANIZATION }));
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
        dispatch({ type: ADD_MEMBER_IN_ORGANIZATION });
        dispatch(getOrganizationById(orgLinkId));
      });
  };
};

export const changeAccessLevel = (org_id, user_id, data, orgLinkId) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(`${API_URL}/organization/${org_id}/members/${user_id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(getOrganizationById(orgLinkId));
      });
  };
};

export const deleteUserFromOrganization = (orgId, userId, linkId) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .delete(`${API_URL}/organization/${orgId}/members/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch(getOrganizationById(linkId));
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
      .get(`${API_URL}/audit_request/organization/all`, {
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
