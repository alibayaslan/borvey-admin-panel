import axios from "axios";
import { ApiRoutes } from "./ApiRoutes";
// export const BASE_URL = "http://localhost:5050";
// Backend'inizin Heroku'daki eski linki yerine Vercel'deki güncel linki gelecek
const BASE_URL = "https://borvey-backend-lyart.vercel.app"; // <-- BU SATIR YENİ VE DOĞRU LİNKİNİZ!

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
