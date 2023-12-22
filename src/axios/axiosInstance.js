import axios from "axios";
import { memoizedRefreshToken } from "../utils/refreshToken";
// import jwt_decode from "jwt-decode";
// import dayjs from "dayjs";



axios.defaults.baseURL = "https://estate-api-2.onrender.com/api/v1/";

// axios.defaults.baseURL = "https://estate-api-2.onrender.com/api/v1/";
// axios.defaults.baseURL = 'http://192.168.43.141:3000/api/v1/';
// axios.defaults.baseURL = 'https://estate-api-2.onrender.com/api/v1/';
// axios.defaults.baseURL = 'http://localhost:3000/api/v1/';


axios.interceptors.request.use(
  async (config) => {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      const result = await memoizedRefreshToken();

      if (result?.accessToken) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${result?.accessToken}`,
        };
      }

      return axios(config);
    }
    return Promise.reject(error);
  }
);

export const axiosInstance = axios;
