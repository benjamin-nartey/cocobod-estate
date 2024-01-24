import axios from 'axios';
import { memoizedRefreshToken } from '../utils/refreshToken';

// axios.defaults.baseURL = 'https://estate-api-2.onrender.com/api/v1/';
axios.defaults.baseURL = 'http://estate.cocobod.net/api/v1/';

axios.interceptors.request.use(
  async (config) => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

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
