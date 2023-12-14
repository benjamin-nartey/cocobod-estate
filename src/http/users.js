import { axiosInstance } from '../axios/axiosInstance';

export const getEnumerators = () => {
  return axiosInstance.get('/users/enumerators');
};
