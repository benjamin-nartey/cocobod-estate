import { createContext, useState, useEffect } from "react";
import { useOnlineStatus } from "../Hooks/useIsOnlineStatus";

import axios from "axios";
import { axiosInstance } from "../axios/axiosInstance";
import state from "../store/store";
import { useLocation, useNavigate } from "react-router-dom";

export const LogoutContext = createContext({
  online: false,
  location: "",
  navigate: "",
  logout: () => null,
});

export const LogoutProvider = ({ children }) => {
  const online = useOnlineStatus();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/login";

  const logout = async () => {
<<<<<<< HEAD
    const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
=======
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    const api = axios.create({
      // baseURL: 'https://estate-api-2.onrender.com/api/v1',
      baseURL: 'http://localhost:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });
>>>>>>> 309412deb89e0660c2694a900a6568e4face2268

    if (online) {
      try {
        state.loadingState = true;
        const response = await axiosInstance.delete("/auth", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        if (!response) {
          return;
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          // localStorage.removeItem("currentUser");
          localStorage.removeItem("currentUserState");
          state.currentUser = {};
          navigate(from, { replace: true });
          return response;
        }
      } catch (error) {
        console.log(error);
      } finally {
        state.loadingState = false;
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  const value = { logout };

  return (
    <LogoutContext.Provider value={value}>{children}</LogoutContext.Provider>
  );
};
