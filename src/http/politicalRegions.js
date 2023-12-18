import { axiosInstance } from '../axios/axiosInstance';

export const getAllPoliticalRegions = () => {
  return axiosInstance.get('/political-region/all');
};
export const getPaginatedPoliticalRegions = (queryParams) => {
  return axiosInstance.get('/political-region/', {
    params: {
      ...queryParams,
    },
  });
};

export const addPoliticalRegion = (data) => {
  return axiosInstance.post(`/political-region`, {
    ...data,
  });
};

export const updatePoliticalRegion = (id, data) => {
  return axiosInstance.patch(`/political-region/${id}`, { ...data });
};

export const deletePoliticalRegion = (id) => {
  return axiosInstance.delete(`/political-region/${id}`);
};
