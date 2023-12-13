import { axiosInstance } from '../axios/axiosInstance';

export const getPaginatedPropertyReferenceCategory = (queryParams) => {
  return axiosInstance.get('/property-reference-categories', {
    params: { ...queryParams },
  });
};

export const addPropertyReferenceCategory = (data) => {
  return axiosInstance.post('/property-reference-categories', { ...data });
};

export const updatePropertyReferenceCategory = (id, data) => {
  return axiosInstance.patch(`/property-reference-categories/${id}`, {
    ...data,
  });
};

export const getPagionatedPropertyUnitReferenceList = (queryParams) => {
  return axiosInstance.get('/property-references', {
    params: { ...queryParams },
  });
};

export const deleteMerge = (id) => {
  return axiosInstance.delete(`/property-reference-categories/${id}`);
};
