import { axiosInstance } from '../axios/axiosInstance';

export const getPaginatedLocation = (queryParams) => {
  return axiosInstance.get('/location', {
    params: { ...queryParams },
  });
};

export const addLocation = (data) => {
  return axiosInstance.post(`/location`, {
    ...data,
  });
};

export const updateLocation = (id, data) => {
  return axiosInstance.patch(`/location/${id}`, { ...data });
};

export const deleteTown = (id) => {
  return axiosInstance.delete(`/location/${id}`);
};
