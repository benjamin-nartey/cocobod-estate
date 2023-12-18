import { createContext, useState, useEffect } from 'react';
import { useOnlineStatus } from '../Hooks/useIsOnlineStatus';

import axios from 'axios';
import state from '../store/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const LogoutContext = createContext({
  online: false,
  location: '',
  navigate: '',
  logout: () => null,
});

export const LogoutProvider = ({ children }) => {
  const online = useOnlineStatus();

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/login';

  const logout = async () => {
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    const api = axios.create({
      baseURL: 'http://192.168.0.178:3000/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (online) {
      try {
        state.loadingState = true;
        const response = await api.delete('/auth');
        if (!response) {
          return;
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          // localStorage.removeItem("currentUser");
          localStorage.removeItem('currentUserState');
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
