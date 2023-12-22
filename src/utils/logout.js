import axios from "axios";
import state from "../store/store";
import { axiosInstance } from "../axios/axiosInstance";

export const Logout = async () => {
<<<<<<< HEAD
  const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));

=======
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
  const api = axios.create({
    // baseURL: 'https://estate-api-2.onrender.com/api/v1/',
    baseURL: 'http://localhost:3000/api/v1/',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });
>>>>>>> 309412deb89e0660c2694a900a6568e4face2268
  try {
    state.loadingState = true;
    const response = await axiosInstance.delete("/auth", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // localStorage.removeItem("currentUser");
    localStorage.removeItem("currentUserState");
    state.currentUser = {};
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    state.auth.loadingState = false;
  }
};
