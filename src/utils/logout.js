import axios from "axios";
import state from "../store/store";

export const Logout = async () => {
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
  const api = axios.create({
    baseURL: "https://cocobod-estates-api.onrender.com/api/v1/",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  try {
    state.loadingState = true;
    await api.delete("/auth");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  } catch (error) {
    console.log(error);
  } finally {
    state.loadingState = false;
  }
};
