import axios from 'axios';
import { API_URL, ASSET_URL } from '../services/urls.js';
import Cookies from 'js-cookie';

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

export const handleOpenReport = audit => {
  const token = Cookies.get('token');
  axios
    .get(`${ASSET_URL}/${audit?.report}`, {
      responseType: 'blob',
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => downloadResponse(response, audit));
};

export const generateReport = audit => {
  const token = Cookies.get('token');
  axios
    .post(`${API_URL}/report/${audit.id}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(({ data }) =>
      axios.get(`${ASSET_URL}/${data.path}`, {
        responseType: 'blob',
        withCredentials: true,
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      }),
    )
    .then(response => downloadResponse(response, audit));
};
