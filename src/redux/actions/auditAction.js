import Cookies from 'js-cookie';
import axios from 'axios';
import {
  AUDIT_REQUEST_CREATE,
  AUDITOR,
  CLEAR_MESSAGES,
  CONFIRM_AUDIT,
  CREATE_PUBLIC_REPORT,
  CUSTOMER,
  DELETE_AUDIT,
  DELETE_REQUEST,
  DOWNLOAD_REPORT_START,
  GET_AUDIT,
  GET_AUDIT_REQUEST,
  GET_AUDITS,
  GET_PUBLIC_REPORT,
  GET_REQUEST,
  IN_PROGRESS,
  NOT_FOUND,
  REQUEST_ERROR,
  RESET_PUBLIC_AUDIT,
  RESOLVED,
  SAVE_PUBLIC_REPORT,
  SET_CURRENT_AUDIT_PARTNER,
} from './types.js';
import { history } from '../../services/history.js';
import { ASSET_URL } from '../../services/urls.js';

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

export const getAuditRequest = id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/audit_request/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data.id) {
          dispatch({ type: GET_REQUEST, payload: data });
        } else {
          dispatch({ type: NOT_FOUND });
        }
      })
      .catch(() => dispatch({ type: NOT_FOUND }));
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

export const getAudit = id => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .get(`${API_URL}/audit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data.id) {
          dispatch({ type: GET_AUDIT, payload: data });
        } else {
          dispatch({ type: NOT_FOUND });
        }
      })
      .catch(() => dispatch({ type: NOT_FOUND }));
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

export const addReportAudit = (values, noRedirect) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(`${API_URL}/audit/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (!noRedirect) {
          history.back();
        }
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

export const confirmAudit = (values, shouldRedirect) => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .post(`${API_URL}/audit`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (!shouldRedirect) {
          history.back();
        }
        dispatch({ type: CONFIRM_AUDIT, payload: data });
      });
  };
};

export const startAudit = (values, goBack) => {
  const newValue = { ...values, action: 'start' };
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
        } else {
          history.push(`/audit-info/${values.id}/auditor`);
        }
      });
  };
};

export const resolveAudit = values => {
  return dispatch => {
    const token = Cookies.get('token');
    axios
      .patch(
        `${API_URL}/audit/${values.id}`,
        { action: 'resolve' },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(({ data }) => dispatch({ type: RESOLVED, payload: data }))
      .catch(() => dispatch({ type: REQUEST_ERROR }));
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

export const getPublicReport = (data, { generate }) => {
  const downloadResponse = res => {
    const blob = new Blob([res.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${
        data?.report_name
          ? data?.report_name
          : data?.project_name + ' report.pdf'
      }`,
    );
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  return dispatch => {
    dispatch({ type: DOWNLOAD_REPORT_START });
    axios
      .post(`${API_URL}/generate-report`, data, { responseType: 'arraybuffer' })
      .then(res => {
        downloadResponse(res);
      });
  };
};
//

export const createPublicReport = data => {
  return dispatch => {
    dispatch({ type: CREATE_PUBLIC_REPORT, payload: data });
  };
};

export const updatePublicReport = data => {
  return dispatch => {
    localStorage.setItem('report', JSON.stringify(data));
    dispatch({ type: CREATE_PUBLIC_REPORT, payload: data });
  };
};

export const getPublicAuditReport = () => {
  return dispatch => {
    const report = JSON.parse(localStorage.getItem('report') || '{}');
    dispatch({ type: GET_PUBLIC_REPORT, payload: report });
  };
};
export const downloadReport = (audit, { generate } = {}) => {
  const token = Cookies.get('token');

  const downloadResponse = (res, audit) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${
        audit?.report_name
          ? audit?.report_name
          : audit?.project_name + ' report.pdf'
      }`,
    );
    document.body.appendChild(link);
    link.click();
  };

  const getReport = (audit, filepath, dispatch) => {
    axios
      .get(`${ASSET_URL}/${filepath}`, {
        responseType: 'blob',
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(response => downloadResponse(response, audit))
      .catch(() => dispatch({ type: REQUEST_ERROR }));
  };

  return dispatch => {
    dispatch({ type: DOWNLOAD_REPORT_START });
    if (generate) {
      axios
        .post(`${API_URL}/report/${audit.id}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => getReport(audit, data.path, dispatch))
        .catch(() => dispatch({ type: REQUEST_ERROR }));
    } else {
      getReport(audit, audit?.report, dispatch);
    }
  };
};

export const handleResetPublicAudit = () => {
  return dispatch => {
    dispatch({ type: RESET_PUBLIC_AUDIT });
  };
};

export const savePublicReport = data => {
  const token = Cookies.get('token');
  return dispatch => {
    axios
      .post(`${API_URL}/no_customer_audit`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        dispatch({ type: SAVE_PUBLIC_REPORT, payload: data });
        const handleRedirect = setTimeout(() => {
          history.push('/profile/audits');
        }, 3000);
        localStorage.removeItem('report');
        localStorage.removeItem('publicIssues');
        return () => clearTimeout(handleRedirect);
      });
  };
  // .catch(() => dispatch({ type: REQUEST_ERROR }));
};

export const clearMessage = () => {
  return { type: CLEAR_MESSAGES };
};
