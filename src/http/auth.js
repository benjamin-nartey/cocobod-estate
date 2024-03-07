import { axiosInstance } from '../axios/axiosInstance';

export const forgotPassword = (data) => {
  return axiosInstance.post('/auth/forgot-password', data);
};

export const resetPassword = (data, token) => {
  return axiosInstance.patch(`/auth/reset-password`, data, {
    params: { token },
  });
};
