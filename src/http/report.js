import { axiosInstance } from '../axios/axiosInstance';

export const getReport = (queryParams) => {
  console.log(queryParams);

  return axiosInstance.get('/report', {
    params: {
      ...queryParams,
    },
  });
};
