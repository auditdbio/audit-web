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
    SELECT_ROLE, UPDATE_USER, CLEAR_SUCCESS,
} from "./types.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

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
          { pathname: `/profile/user-info` },
          {
            some: true,
          }
        );
      })
      .catch(({ response }) => {
          console.log(response)
        dispatch({ type: SIGN_IN_ERROR, payload: response.data });
      });
  };
};

export const clearUserError = () => {
  return { type: CLEAR_ERROR };
};

export const clearUserSuccess = () => {
    return {type: CLEAR_SUCCESS}
}

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
    axios
      .patch(
        `${API_URL}/users`,
        { current_role: value },
        {
          headers: {
            Authorization: "Bearer " + Cookies.get("token"),
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        dispatch({ type: SELECT_ROLE, payload: data });
        localStorage.setItem("user", JSON.stringify(data));
        history.push(
          { pathname: `/profile/user-info` },
          {
            some: true,
          }
        );
      });
  };
};

export const changePassword = (value) => {
    return (dispatch) => {
        axios
            .patch(
                `${API_URL}/users`,
                { password: value },
                {
                    headers: {
                        Authorization: "Bearer " + Cookies.get("token"),
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(({ data }) => {
                dispatch({ type: UPDATE_USER, payload: data });
            });
    }
}
