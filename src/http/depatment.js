import { axiosInstance } from '../axios/axiosInstance';

export const getAllDepartments = () => {
  return axiosInstance.get('/departments/all');
};
