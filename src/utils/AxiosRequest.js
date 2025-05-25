import axios from "axios";
import { ApiRoutes } from "./ApiRoutes";
// export const BASE_URL = "http://localhost:5050";
// Backend'inizin Heroku'daki eski linki yerine Vercel'deki güncel linki gelecek

// ARTIK BASE_URL'İ DİREKT BURAYA YAZMIYORUZ.
// Bunun yerine, Vercel ortam değişkenlerinden REACT_APP_API_URL'i çekiyoruz.
// Bu, hem esneklik sağlar hem de farklı ortamlarda (geliştirme, üretim) farklı backend'ler kullanmanıza olanak tanır.
const BASE_URL = process.env.REACT_APP_API_URL; // Burası güncellendi!

export const AxiosRequest = (method, url, data) => {
  const token = localStorage.getItem("token");
  const config = {
    method: method,
    baseURL: BASE_URL, // BASE_URL artık ortam değişkeninden gelecek
    headers: {
      Authorization: `${token}`,
    },
    url: url,
    data: data,
  };

  return axios(config);
};
