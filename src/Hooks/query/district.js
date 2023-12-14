import { useQuery } from '@tanstack/react-query';
import { getPaginatedDistricts } from '../../http/district';
import { useState } from 'react';

export const useGetPaginatedDistricts = (pageNum) => {
  const [paginatedData, setPaginatedData] = useState({
    pageSize: 0,
    total: 0,
  });

  const { ...props } = useQuery({
    queryKey: ['district', pageNum],
    queryFn: () => {
      return getPaginatedDistricts(pageNum);
    },
    keepPreviousData: true,
    onSuccess: (response) => {
      setPaginatedData({
        pageSize: response?.data.meta.recordsPerPage,
        total: response?.data.meta.totalRecords,
      });
    },
  });

  return [paginatedData, props];
};
