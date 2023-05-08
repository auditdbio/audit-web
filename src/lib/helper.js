import Cookies from 'js-cookie';

export const isAuth = () => {
  const token = Cookies.get('token');
  const localToken = JSON.parse(localStorage.getItem('token'));
  const localUser = JSON.parse(localStorage.getItem('user'));
  return !!(token && localToken && localUser);
};
