import Cookies from "js-cookie";
import { PROJECT_CREATE } from "../actions/types.js";

const initialState = {
  token: Cookies.get("token") || "",
  isAuth: false,
  user: JSON.parse(localStorage.getItem("user")) || {},
  error: null,
};
export const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_CREATE:
    // return { token: action.payload.token, isAuth: true, user: action.payload.user }
    default:
      return state;
  }
};
