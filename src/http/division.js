import { axiosInstance } from '../axios/axiosInstance';

export const getAllDivisions = () => {
  return axiosInstance.get('/divisions/all');
};
