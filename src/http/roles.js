import { axiosInstance } from '../axios/axiosInstance';

export const getRoles = () => {
  return axiosInstance.get('/roles/all');
};
