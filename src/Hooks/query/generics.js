import { useQuery } from '@tanstack/react-query';

import { useState } from 'react';

export const useGetPaginatedData = (
  queryKey,
  id = '',
  queryParams,
  requestFn
) => {
  const [paginatedData, setPaginatedData] = useState({
    pageSize: 0,
    total: 0,
  });

  const { ...props } = useQuery({
    queryKey: [queryKey, queryParams?.pageNum],
    queryFn: () => {
      if (!!id !== false) {
        return requestFn(id, queryParams);
      } else {
        return requestFn(queryParams);
      }
    },
    keepPreviousData: true,
    onSuccess: (response) => {
      setPaginatedData({
        pageSize: response?.data?.meta?.recordsPerPage,
        total: response?.data?.meta?.totalRecords,
      });
    },
  });

  return [paginatedData, props];
};
