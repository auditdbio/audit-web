import axios from 'axios';
import { ASSET_URL } from '../services/urls.js';
import Cookies from 'js-cookie';

export const handleViewReport = audit => {
  axios
    .get(`${ASSET_URL}/${audit?.report}`, {
      responseType: 'blob',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
    })
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      window.open(url, '_blank');
    });
};
