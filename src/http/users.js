import { axiosInstance } from '../axios/axiosInstance';

export const getEnumerators = () => {
  return axiosInstance.get('/users/enumerators');
};

export const getAllUsers = (queryParams) => {
  return axiosInstance.get('/users', {
    params: { ...queryParams },
  });
};

export const updateUser = (id, data) => {
  return axiosInstance.patch(`/users/staff/${id}`, {
    ...data,
  });
};
