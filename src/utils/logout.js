import axios from 'axios';
import state from '../store/store';
import { axiosInstance } from '../axios/axiosInstance';

export const Logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    state.loadingState = true;
    const response = await axios.delete('/auth', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // localStorage.removeItem("currentUser");
    // localStorage.removeItem('currentUserState');
    state.currentUser = {};
    return response;
  } catch (error) {
    console.log(error);
  } finally {
    state.auth.loadingState = false;
  }
};
