import {
  PROJECT_CREATEu,
  SIGN_IN_ERROR,
  USER_IS_ALREADY_EXIST,
  USER_SIGNIN,
  USER_SIGNUP,
} from "./types.js";
import axios from "axios";
import Cookies from "js-cookie";
import { history } from "../../services/history.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createProject = (values) => {
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
