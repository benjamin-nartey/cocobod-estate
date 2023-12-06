import { axiosInstance } from '../axios/axiosInstance';

export const getAllRegions = () => {
  return axiosInstance.get('/region/all');
};
