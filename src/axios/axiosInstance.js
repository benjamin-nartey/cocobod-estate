import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
// import { AuthContext } from "../components/context/useAuth.context";

let accessToken = localStorage.getItem("accessToken")
  ? JSON.parse(localStorage.getItem("accessToken"))
  : null;

let refreshToken = localStorage.getItem("refreshToken")
  ? JSON.parse(localStorage.getItem("refreshToken"))
  : null;

const axiosInstance = axios.create({
  baseURL: "https://cocobod-estates-api.onrender.com/api/v1/",
  headers: { Authorization: `Bearer ${accessToken}` },
});

axiosInstance.interceptors.request.use(async (req) => {
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken")
      ? JSON.parse(localStorage.getItem("accessToken"))
      : null;
    req.headers.Authorization = `Bearer ${accessToken}`;
  }

  const user = jwt_decode(accessToken);
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
  if (!isExpired) return req;

  const response = await axios.post(
    "https://cocobod-estates-api.onrender.com/api/v1/auth/refresh-token",
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  localStorage.setItem(
    "accessToken",
    JSON.stringify(response.data.accessToken)
  );
  localStorage.setItem(
    "refreshToken",
    JSON.stringify(response.data.refreshToken)
  );
  req.headers.Authorization = `Bearer ${response.data.accessToken}`;

  return req;
});

export default axiosInstance;
