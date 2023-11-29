import axios from 'axios';
import state from '../store/store';

export const Logout = async () => {
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
  const api = axios.create({
    baseURL: 'https://estate-api-2.onrender.com/api/v1/',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  try {
    state.auth.loadingState = true;
    const response = await api.delete('/auth');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
    state.auth.currentUser = null;
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    state.auth.loadingState = false;
  }
};
