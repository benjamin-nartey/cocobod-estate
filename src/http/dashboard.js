import { axiosInstance } from '../axios/axiosInstance';

export const getDashboardData = () => {
  return axiosInstance.get('/dashboard');
};
