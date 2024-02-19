import { axiosInstance } from '../axios/axiosInstance';

export const searchResource = async (url, searchTerm) => {
  return await axiosInstance.get(url, {
    params: { search: searchTerm, pageNum: 1 },
  });
};
