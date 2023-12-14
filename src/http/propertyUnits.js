import { axiosInstance } from '../axios/axiosInstance';

export const getPaginatedPropertyUnits = (queryParams) => {
  return axiosInstance.get('/property-units', {
    params: {
      ...queryParams,
    },
  });
};

export const getPropertyUnits = (queryParams) => {
  return axiosInstance.get('/property-units/all', {
    params: { ...queryParams },
  });
};

export const getPropertyReferenceUnits = (queryParams) => {
  console.log('Retrieving property');
  return axiosInstance.get('/property-references/all', {
    params: { ...queryParams },
  });
};
