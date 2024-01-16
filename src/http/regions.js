import { axiosInstance } from '../axios/axiosInstance';

export const getAllRegions = () => {
  return axiosInstance.get('/region/all');
};

export const deleteRegion = (id) => {
  return axiosInstance.delete(`/region/${id}`);
};
