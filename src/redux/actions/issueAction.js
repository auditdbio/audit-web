import Cookies from 'js-cookie';
import axios from 'axios';
import {
  ADD_AUDIT_ISSUE,
  DELETE_ISSUE,
  DELETE_PUBLIC_ISSUE,
  DISCLOSE_ALL_ISSUES,
  GET_AUDIT_ISSUES,
  REQUEST_ERROR,
  SET_READ_CHANGES,
  UPDATE_AUDIT_ISSUE,
} from './types.js';
import { API_URL } from '../../services/urls.js';

export const getIssues = auditId => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/audit/${auditId}/issue`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data: issues }) =>
        dispatch({ type: GET_AUDIT_ISSUES, payload: { auditId, issues } }),
      );
  };
};

export const getPublicIssues = (data, auditId) => {
  return dispatch => {
    dispatch({ type: GET_AUDIT_ISSUES, payload: { auditId, issues: data } });
  };
};

export const updatePublicIssue = data => {
  return dispatch => {
    dispatch({ type: UPDATE_AUDIT_ISSUE, payload: { issue: data } });
  };
};

export const addPublicIssue = data => {
  return dispatch => {
    dispatch({ type: ADD_AUDIT_ISSUE, payload: { issue: data } });
  };
};

export const deletePublicIssue = data => {
  return dispatch => {
    dispatch({ type: DELETE_PUBLIC_ISSUE, payload: { issue: data } });
  };
};

export const deleteIssue = (issue, auditId) => {
  const token = Cookies.get('token');

  return dispatch => {
    axios
      .delete(`${API_URL}/audit/${auditId}/issue/${issue.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: DELETE_ISSUE, payload: { issue: data } });
      });
  };
};

export const addAuditIssue = (auditId, values) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .post(`${API_URL}/audit/${auditId}/issue`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) =>
        dispatch({
          type: ADD_AUDIT_ISSUE,
          payload: {
            id: auditId,
            issue: data,
          },
        }),
      )
      .catch(e => dispatch({ type: REQUEST_ERROR }));
  };
};

export const updateAuditIssue = (auditId, issueId, values) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/audit/${auditId}/issue/${issueId}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({
          type: UPDATE_AUDIT_ISSUE,
          payload: {
            id: auditId,
            issue: data,
          },
        });
      })
      .catch(e => dispatch({ type: REQUEST_ERROR }));
  };
};

export const discloseAllIssues = auditId => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/audit/${auditId}/disclose_all`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({
          type: DISCLOSE_ALL_ISSUES,
          payload: data,
        });
      })
      .catch(e => dispatch({ type: REQUEST_ERROR }));
  };
};

export const setReadChanges = (auditId, issueId, readCount) => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .patch(`${API_URL}/audit/${auditId}/${issueId}/read/${readCount}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() =>
        dispatch({
          type: SET_READ_CHANGES,
          payload: { issueId, readCount },
        }),
      );
  };
};
