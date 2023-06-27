import Cookies from 'js-cookie';
import axios from 'axios';
import {
  ADD_AUDIT_ISSUE,
  DISCLOSE_ALL_ISSUES,
  GET_AUDIT_ISSUES,
  REQUEST_ERROR,
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
