import axios from "axios";
import Cookies from "js-cookie";
import { history } from "../../services/history.js";
import {
  AUTH_TRUE,
  CLEAR_ERROR,
  LOG_OUT,
  SIGN_IN_ERROR,
  USER_IS_ALREADY_EXIST,
  USER_SIGNIN,
  USER_SIGNUP,
  SELECT_ROLE,
} from "./types.js";

const API_URL = "http://dev.auditdb.io:3001/api";

export const signIn = (values) => {
  return (dispatch) => {
    axios
      .post(`${API_URL}/auth/login`, values)
      .then(({ data }) => {
        Cookies.set("token", data.token, { expires: 1 });
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({ type: USER_SIGNIN, payload: data });
        history.push(
          { pathname: `/home-${data.user.current_role}` },
          {
            some: true,
          }
        );
      })
      .catch(({ response }) => {
        dispatch({ type: SIGN_IN_ERROR });
      });
  };
};

export const clearUserError = () => {
  return { type: CLEAR_ERROR };
};

export const signUp = (values) => {
  return (dispatch) => {
    axios
      .post(`${API_URL}/users`, values)
      .then(({ data }) => {
        dispatch({ type: USER_SIGNUP, payload: data });
        history.push("/sign-in", {
          some: true,
        });
      })
      .catch(({ response }) => {
        dispatch({ type: USER_IS_ALREADY_EXIST });
      });
  };
};

export const authenticate = () => {
  return { type: AUTH_TRUE };
};

export const logout = () => {
  history.push("/");
  Cookies.remove("token");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { type: LOG_OUT };
};

export const changeRole = (value) => {
  return (dispatch) => {
    // axios.post(`${API_URL}/users`, value).then(({ data }) => {
    //   dispatch({ type: SELECT_ROLE, payload: data });
    //   history.push(
    //     { pathname: `/home-${data.user.current_role}` },
    //     {
    //       some: true,
    //     }
    //   );
    // });
    const data = {
      user: {
          id: "1",
          current_role: value,
      }
    };
    dispatch({ type: SELECT_ROLE, payload: data });
    history.push(
      { pathname: `/home-${value}` },
      {
        some: true,
      }
    );
  };
};
// .catch(({response}) => {
//     dispatch({type: USER_IS_ALREADY_EXIST});
// });
