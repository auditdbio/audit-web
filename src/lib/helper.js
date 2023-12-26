import Cookies from 'js-cookie';

const IS_DEV = import.meta.env?.DEV;

export const isAuth = () => {
  const token = Cookies.get('token');
  const localToken = JSON.parse(localStorage.getItem('token'));
  const localUser = JSON.parse(localStorage.getItem('user'));
  return !!(token && localToken && localUser);
};

export const addTestsLabel = value => {
  const label = value.toLowerCase().replace(/ /g, '-');
  return IS_DEV ? { 'data-testid': label } : {};
};

export const addSpacesToCamelCase = str => {
  return typeof str === 'string' ? str.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
};

export const calcTotalPages = totalCount => {
  return Math.ceil(totalCount / 12);
};
