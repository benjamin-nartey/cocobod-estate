import { axiosInstance } from '../axios/axiosInstance';

export const getPaginatedDistricts = (queryParams) => {
  return axiosInstance.get(`/district`, {
    params: { ...queryParams },
  });
};

export const addDistrict = (data) => {
  return axiosInstance.post(`/district`, {
    ...data,
  });
};

export const updateDistrict = (id, data) => {
  return axiosInstance.patch(`/district/${id}`, { ...data });
};

export const deleteDistrict = (id) => {
  return axiosInstance.delete(`/district/${id}`);
};
