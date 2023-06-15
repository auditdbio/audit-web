import axios from 'axios';
import { ASSET_URL } from '../services/urls.js';
import Cookies from 'js-cookie';

export const handleOpenReport = audit => {
  axios
    .get(`${ASSET_URL}/${audit?.report}`, {
      responseType: 'blob',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    .then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${
          audit?.report_name ? audit?.report_name : audit?.project_name + '.pdf'
        }`,
      );
      document.body.appendChild(link);
      link.click();
    });
};
