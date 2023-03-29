import {GET_MY_PROJECTS, GET_PROJECTS, PROJECT_CREATE, PROJECT_UPDATE} from "./types.js";
import axios from "axios";
import Cookies from "js-cookie";
import { history } from "../../services/history.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createProject = (values) => {
  return async (dispatch) => {
    const token = Cookies.get("token");
    await axios
      .post(`${API_URL}/projects`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: PROJECT_CREATE, payload: data });
        history.push("/profile/projects");
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  };
};
export const editProject = (values) => {
  return async (dispatch) => {
    const token = Cookies.get("token");
    await axios
      .patch(`${API_URL}/projects`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: PROJECT_UPDATE, payload: data });
        history.push("/profile/projects", {
          some: true,
        });
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  };
};
export const getAllProjects = (values = "") => {
  const token = Cookies.get("token");
  return async (dispatch) => {
    await axios
      .get(`${API_URL}/projects/all?tags=${values.toLowerCase()}&limit=100&skip=0`,
          // { headers: { Authorization: `Bearer ${token}` },}
      )
      .then(({ data }) => {
        dispatch({ type: GET_PROJECTS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  };
};

export const getProjects = () => {
  const token = Cookies.get("token");
  return (dispatch) => {
    axios
        .get(`${API_URL}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          dispatch({ type: GET_MY_PROJECTS, payload: data });
        })
        .catch(({ response }) => {
          console.log(response, "res");
        });
  };
};
