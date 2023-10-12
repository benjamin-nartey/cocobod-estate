import axios from "axios";

export default axios.create({
  baseURL: "https://json-api-6r5i.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const privateAxios = axios.create({
  baseURL: "https://cocobod-estates-api.onrender.com/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});
