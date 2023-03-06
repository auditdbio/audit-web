import { GET_PROJECTS, PROJECT_CREATE } from "./types.js";
import axios from "axios";
import Cookies from "js-cookie";
import { history } from "../../services/history.js";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createProject = (values) => {
  return (dispatch) => {
    console.log("initial", values);
    const data = {
      description: values.description,
      name: values.name,
      scope: values.projectLinks,
      status: "status test",
      tags: values.tags,
    };
    const token = Cookies.get("token");
    axios
      .post(`${API_URL}/projects`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        console.log("create project", data);
        dispatch({ type: PROJECT_CREATE });
        history.push("/home-customer", {
          some: true
        });
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  };
};
export const getProjects = (values) => {
  const token = Cookies.get("token");
  return (dispatch) => {
    axios
      .get(`${API_URL}/projects/all?tags=${values}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        console.log("get projects", data);
        dispatch({ type: GET_PROJECTS, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  };
};
