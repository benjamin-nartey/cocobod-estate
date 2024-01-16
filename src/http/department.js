import { axiosInstance } from '../axios/axiosInstance';

export const getAllDepartments = () => {
  return axiosInstance.get('/departments/all');
};

export const getPaginatedDepartments = (queryParams) => {
  return axiosInstance.get('/departments', {
    params: { ...queryParams },
  });
};

export const getDepartmentByDivisionId = (divisionId) => {
  return axiosInstance.get('/departments/all', {
    params: { divisionFilter: divisionId },
  });
};

export const addDepartment = (data) => {
  return axiosInstance.post('/departments', { ...data });
};

export const updateDepartment = (id, data) => {
  return axiosInstance.patch(`departments/${id}`, { ...data });
};

export const deleteDepartment = (id) => {
  return axiosInstance.delete(`/departments/${id}`);
};
