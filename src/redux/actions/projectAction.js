import {GET_MY_PROJECTS, GET_PROJECTS, PROJECT_CREATE, PROJECT_UPDATE, SEARCH_PROJECTS} from "./types.js";
import axios from "axios";
import Cookies from "js-cookie";
import { history } from "../../services/history.js";
import dayjs from "dayjs";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const createProject = (values) => {
  return async (dispatch) => {
    const token = Cookies.get("token");
    await axios
      .post(`${API_URL}/project`, values, {
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
      .patch(`${API_URL}/project/${values.id}`, values, {
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

export const changeStatusProject = (values) => {
    return async (dispatch) => {
        const token = Cookies.get("token");
        await axios
            .patch(`${API_URL}/project/${values.id}`, values, {
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
      .get(`${API_URL}/search?kind=project&query=&tags=${values.toLowerCase()}&per_page=100&page=0`,
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
        .get(`${API_URL}/my_project`, {
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

export const searchProjects = (values) => {

    const searchValues = {
        query: values?.search || '',
        tags: values?.tags || '',
        ready_to_wait: values?.ready_to_wait || '',
        dateFrom: dayjs().valueOf(values?.dateFrom) || '',
        dateTo: dayjs().valueOf(values?.dateTo)  || '',
        priceFrom: parseInt(values?.price.from) || '',
        priceTo: parseInt(values?.price.to) || '',
        sort: values?.sort || 1,
    }
  return (dispatch) => {
    axios
        .get(`${API_URL}/search?query=${searchValues.query}&tags=${searchValues.tags.map(tag => tag + ',')}${searchValues.ready_to_wait && "&ready_to_wait="`${searchValues.ready_to_wait}`}&sort_by=price&priceFrom=${searchValues.priceFrom}&priceTo=${searchValues.priceTo}&dateFrom=${searchValues.dateFrom}&dateTo=${searchValues.dateTo}&sort_order=${searchValues.sort}&page=0&per_page=0&kind=project`)
        // .get(`${API_URL}/search?query=${searchValues.query}&tags=${searchValues.tags.map(tag => tag + ',')}&${searchValues.ready_to_wait && "&ready_to_wait="`${searchValues.ready_to_wait}`}&sort_by=price&priceFrom=${searchValues.priceFrom}&priceTo=${searchValues.priceTo}&sort_order=1&page=0&per_page=0&kind=project`)
        .then(({ data }) => {
          dispatch({ type: SEARCH_PROJECTS, payload: data });
        })
        .catch(({ response }) => {
          console.log(response, "res");
        });
  };
};
