import { axiosInstance } from '../axios/axiosInstance';

export const uploadReferences = (data) => {
  return axiosInstance.post('property-references/batch-upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
