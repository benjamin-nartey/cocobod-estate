import { axiosInstance } from '../axios/axiosInstance';

export const getPaginatedPropertyUnits = (queryParams) => {
  return axiosInstance.get('/property-units', {
    params: {
      ...queryParams,
    },
  });
};
