import Cookies from 'js-cookie';

const IS_DEV = import.meta.env?.DEV;

export const isAuth = () => {
  const token = Cookies.get('token');
  const localUser = JSON.parse(localStorage.getItem('user'));
  return !!(token && localUser);
};

export const addTestsLabel = value => {
  const label = value.toLowerCase().replace(/ /g, '-');
  return IS_DEV ? { 'data-testid': label } : {};
};

export const addSpacesToCamelCase = str => {
  return typeof str === 'string' ? str.replace(/([a-z])([A-Z])/g, '$1 $2') : '';
};

export const capitalize = str => {
  return typeof str === 'string' && str.length
    ? str[0].toUpperCase() + str.slice(1).toLowerCase()
    : '';
};

export const dateConverter = date => {
  return date > 1000000000000 ? date / 1000 : date * 1000;
};

export const encodeBase64url = str => {
  return window
    .btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '~')
    .replace(/=/g, '_');
};

export const decodeBase64url = str => {
  const s = str.replace(/-/g, '+').replace(/~/g, '/').replace(/_/g, '=');
  return window.atob(s);
};

export const getAverageFeedbackRating = rating => {
  if (rating) {
    const values = Object.values(rating).filter(it => !!it);
    const average = values.reduce((acc, it) => acc + it, 0) / values.length;
    return Math.round(average * 100) / 100;
  }

  return 0;
};

export const issuesCounter = issues => {
  if (issues.length > 1) {
    return `${issues.length} issues`;
  } else {
    return `${issues.length} issue`;
  }
};
