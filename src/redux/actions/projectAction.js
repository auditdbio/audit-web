import {
  CLEAR_SUCCESS, CLOSE_THE_PROJECT,
  GET_MY_PROJECTS,
  GET_PROJECTS,
  PROJECT_CREATE,
  PROJECT_UPDATE,
  PROJECT_UPDATE_STATUS,
  SEARCH_PROJECTS
} from './types.js'
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

export const createProjectNoRedirect = (values) => {
    return async (dispatch) => {
        const token = Cookies.get("token");
        await axios
            .post(`${API_URL}/project`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                localStorage.setItem("project", JSON.stringify(data));
                dispatch({ type: PROJECT_CREATE, payload: data });
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

export const editProjectNoRedirect = (values) => {
    return async (dispatch) => {
        const token = Cookies.get("token");
        await axios
            .patch(`${API_URL}/project/${values.id}`, values, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(({ data }) => {
                localStorage.setItem("project", JSON.stringify(data));
                dispatch({ type: PROJECT_UPDATE, payload: data });
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
                dispatch({ type: PROJECT_UPDATE_STATUS, payload: data });
                // history.push("/profile/projects", {
                //     some: true,
                // });
            })
            .catch(({ response }) => {
                console.log(response, "res");
            });
    };
};

export const closeProject = (values) => {
  return async (dispatch) => {
    const token = Cookies.get("token");
    await axios
      .patch(`${API_URL}/project/${values.id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        dispatch({ type: CLOSE_THE_PROJECT, payload: data });
      })
      .catch(({ response }) => {
        console.log(response, "res");
      });
  };
}

export const clearProjectMessage = () => {
    return {type: CLEAR_SUCCESS}
}

export const getAllProjects = (values = "") => {
  const token = Cookies.get("token");
  return async (dispatch) => {
    await axios
        .get(`${API_URL}/search?query=${values}&tags=&sort_order=1&page=0&per_page=0&kind=project`)
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
        dateFrom: +new Date() + 60000 < +new Date(values?.dateFrom) ? dayjs().valueOf(values?.dateFrom) : '',
        dateTo: +new Date() + 60000 < +new Date(values?.dateTo) ? dayjs().valueOf(values?.dateTo) : '',
        priceFrom: parseInt(values?.price.from) || '',
        priceTo: parseInt(values?.price.to) || '',
        sort: values?.sort || 1,
    }
  return (dispatch) => {
    axios
        .get(`${API_URL}/search?query=${searchValues.query}&tags=${searchValues.tags.map(tag => tag).join(',')}${searchValues.ready_to_wait ? `&ready_to_wait=${searchValues.ready_to_wait}` : ''}&sort_by=price${searchValues.priceFrom ? `&price_from=${searchValues.priceFrom}` : ''}${searchValues.priceTo ? `&price_to=${searchValues.priceTo}` : ''}${searchValues.date_from ? `&date_from=${searchValues.dateFrom}` : ''}${searchValues.dateTo ? `&date_to=${searchValues.dateTo}`: ''}&sort_order=${searchValues.sort}&page=0&per_page=0&kind=project`)
        // .get(`${API_URL}/search?query=${searchValues.query}&tags=${searchValues.tags.map(tag => tag + ',')}&${searchValues.ready_to_wait && "&ready_to_wait="`${searchValues.ready_to_wait}`}&sort_by=price&priceFrom=${searchValues.priceFrom}&priceTo=${searchValues.priceTo}&sort_order=1&page=0&per_page=0&kind=project`)
        .then(({ data }) => {
          dispatch({ type: SEARCH_PROJECTS, payload: data });
        })
        .catch(({ response }) => {
          console.log(response, "res");
        });
  };
};
