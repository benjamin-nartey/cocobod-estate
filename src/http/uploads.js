import { axiosInstance } from '../axios/axiosInstance';

export const uploadData = (data, uploadUrl) => {
  return axiosInstance.post(`${uploadUrl}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
