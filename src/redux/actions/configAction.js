import { GET_CONFIG_FILTER } from './types.js';

export const getFilterData = () => {
  return dispatch => {
    fetch('../../filterFile.conf')
      .then(response => response.text())
      .then(text => {
        dispatch({
          type: GET_CONFIG_FILTER,
          payload: text.split('\n').filter(el => el),
        });
      })
      .catch(error => {
        console.error('Failed to load file:', error);
      });
  };
};
