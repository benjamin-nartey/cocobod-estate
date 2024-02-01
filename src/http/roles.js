import { axiosInstance } from '../axios/axiosInstance';

export const getRoles = () => {
  return axiosInstance.get('/roles/all');
};

export const getPaginatedRoles = (queryParams) => {
  return axiosInstance.get('/roles', {
    params: { ...queryParams },
  });
};

export const addRole = (data) => {
  return axiosInstance.post(`/roles`, {
    ...data,
  });
};

export const updateRole = (id, data) => {
  return axiosInstance.patch(`/roles/${id}`, { ...data });
};

export const deleteRole = (id) => {
  return axiosInstance.delete(`/roles/${id}`);
};

export const getPermissions = () => {
  return axiosInstance.get('/permissions/all');
};
