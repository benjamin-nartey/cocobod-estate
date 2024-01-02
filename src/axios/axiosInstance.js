import axios from 'axios';

export let baseURL = import.meta.env.VITE_BASE_URL;
const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor to add access token to authorization header
axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
    ? localStorage.getItem('accessToken')
    : null;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to refresh access token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken =
          localStorage.getItem('refreshToken') &&
          localStorage.getItem('refreshToken');
        const { data } = await axios.get(`${baseURL}/auth/refresh`, {
          headers: { Authorization: 'Bearer ' + refreshToken },
        });

        localStorage.setItem('accessToken', data?.accessToken);
        localStorage.setItem('refreshToken', data?.refreshToken);
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };

// export const request = ({ ...options }) => {
//   const onSuccess = (response) => response;
//   const onError = (error) => {
//     throw new Error(error?.response?.data?.message);
//   };

//   return client(options).then(onSuccess).catch(onError);
// };
