import { axiosInstance } from '../axios/axiosInstance';

export const getAllTowns = () => {
  return axiosInstance.get('/location/all');
};

export const getPaginatedTowns = (queryParams) => {
  return axiosInstance.get('/location', {
    params: { ...queryParams },
  });
};

export const getTownByDistrictId = (id) => {
  return axiosInstance.get('/location/all', {
    params: {
      districtFilter: id,
    },
  });
};
