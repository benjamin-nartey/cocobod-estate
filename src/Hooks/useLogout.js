import axios from 'axios';
import state from '../store/store';
import { useState } from 'react';

export const useLogout = async () => {
  const [logoutResponse, setLogoutResponse] = useState('');
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
  const api = axios.create({
    baseURL: 'https://estate-api-2.onrender.com/api/v1/',
    // baseURL: 'http://localhost:3000/api/v1/',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  try {
    state.loadingState = true;
    setLogoutResponse(async () => await api.delete('/auth'));
    // const response = await api.delete("/auth");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // localStorage.removeItem("currentUser");
    localStorage.removeItem('currentUserState');
    state.currentUser = {};
    return logoutResponse;
  } catch (error) {
    console.log(error);
  } finally {
    state.loadingState = false;
  }
};
