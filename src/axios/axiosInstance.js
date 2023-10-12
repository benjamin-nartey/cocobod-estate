import axios from "axios";
import { memoizedRefreshToken } from "../utils/refreshToken";
// import jwt_decode from "jwt-decode";
// import dayjs from "dayjs";
// // import { AuthContext } from "../components/context/useAuth.context";

// let accessToken = localStorage.getItem("accessToken")
//   ? JSON.parse(localStorage.getItem("accessToken"))
//   : null;

// let refreshToken = localStorage.getItem("refreshToken")
//   ? JSON.parse(localStorage.getItem("refreshToken"))
//   : null;

// const axiosInstance = axios.create({
//   baseURL: "https://cocobod-estates-api.onrender.com/api/v1/",
//   headers: { Authorization: `Bearer ${accessToken}` },
// });

// axiosInstance.interceptors.request.use(async (req) => {
//   if (!accessToken) {
//     accessToken = localStorage.getItem("accessToken")
//       ? JSON.parse(localStorage.getItem("accessToken"))
//       : null;
//     req.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   const user = jwt_decode(accessToken);
//   const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
//   if (!isExpired) return req;

//   const response = await axios.post(
//     "https://cocobod-estates-api.onrender.com/api/v1/auth/refresh-token",
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${refreshToken}`,
//       },
//     }
//   );

//   localStorage.setItem(
//     "accessToken",
//     JSON.stringify(response.data.accessToken)
//   );

//   localStorage.setItem(
//     "refreshToken",
//     JSON.stringify(response.data.refreshToken)
//   );

//   req.headers.Authorization = `Bearer ${response?.data?.accessToken}`;

//   return req;
// });

// export default axiosInstance;

axios.defaults.baseURL = "https://cocobod-estates-api.onrender.com/api/v1/";

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
