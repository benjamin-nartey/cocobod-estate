import { axiosInstance } from '../axios/axiosInstance';

export const getAllPoliticalDistricts = () => {
  return axiosInstance.get('political-district/all');
};

export const getPaginatedPoliticalDistricts = (queryParams) => {
  return axiosInstance.get('political-district', {
    params: {
      ...queryParams,
    },
  });
};

export const addPoliticalDistrict = (data) => {
  return axiosInstance.post(`/political-district`, {
    ...data,
  });
};

export const updatePoliticalDistrict = (id, data) => {
  return axiosInstance.patch(`/political-district/${id}`, { ...data });
};

export const deletePoliticalDistrict = (id) => {
  return axiosInstance.delete(`/political-district/${id}`);
};
