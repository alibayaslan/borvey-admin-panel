import axios from "axios";
import { ApiRoutes } from "./ApiRoutes";
// const BASE_URL = "http://localhost:5050";
const BASE_URL = "https://borvey-backend-e307b0a6bac7.herokuapp.com";

export const AxiosRequest = (method, url, data) => {
  const token = localStorage.getItem("token");
  const config = {
    method: method,
    baseURL: BASE_URL,
    headers: {
      Authorization: `${token}`,
    },
    url: url,
    data: data,
  };

  return axios(config);
};
