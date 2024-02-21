import { createContext, useState, useEffect } from 'react';
import { useOnlineStatus } from '../Hooks/useIsOnlineStatus';

import axios from 'axios';
import { axiosInstance } from '../axios/axiosInstance';
import state from '../store/store';
import { useLocation, useNavigate } from 'react-router-dom';

export const LogoutContext = createContext({
  online: false,
  isOffLineLogout: false,
  setIsOffLineLogout: () => false,
  location: '',
  navigate: '',
  logout: () => null,
});

export const LogoutProvider = ({ children }) => {
  const online = useOnlineStatus();
  const [isOffLineLogout, setIsOffLineLogout] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/login';

  const logout = async () => {
    const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
    const api = axios.create({
      // baseURL: 'https://estate-api-2.onrender.com/api/v1',
      baseURL: 'https://estate.cocobod.net/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (online) {
      try {
        state.auth.loadingState = true;
        const response = await api.delete('/auth', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        if (!response) {
          return;
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          state.auth.currentUser = null;
          navigate('/', { replace: true });
          return response;
        }
      } catch (error) {
        console.log(error);
      } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        state.auth.currentUser = null;
        navigate('/', { replace: true });
        state.auth.loadingState = false;
      }
    } else {
      setIsOffLineLogout(true);
      state.auth.currentUser = null;
      navigate(from, { replace: true });
      state.auth.loadingState = false;
    }
  };

  const value = { logout, isOffLineLogout, setIsOffLineLogout };

  return (
    <LogoutContext.Provider value={value}>{children}</LogoutContext.Provider>
  );
};
