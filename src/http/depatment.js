import { axiosInstance } from '../axios/axiosInstance';

export const getAllDepartments = () => {
  return axiosInstance.get('/departments/all');
};

export const getDepartmentByDivisionId = (divisionId) => {
  return axiosInstance.get('/departments/all', {
    params: { divisionFilter: divisionId },
  });
};
