import { useQuery } from '@tanstack/react-query';
import { getAllDistrict, getPaginatedDistricts } from '../../http/district';
import { useState } from 'react';
import { getTownByDistrictId } from '../../http/town';

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

export const useGetDistricts = (options = {}) => {
  return useQuery({
    queryKey: ['district'],
    queryFn: getAllDistrict,
    ...options,
  });
};

export const useGetTownByDistrictId = (districtId) => {
  return useQuery({
    queryKey: ['getTownByDistrictId'],
    queryFn: () => {
      return getTownByDistrictId(districtId);
    },
    enabled: false,
  });
};
