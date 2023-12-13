import { axiosInstance } from '../axios/axiosInstance';

export const getAllPropertyTypes = () => {
  return axiosInstance.get('property-types/all');
};

export const getPaginatedPropertyTypes = (queryParams) => {
  return axiosInstance.get('property-types', {
    params: { ...queryParams },
  });
};
