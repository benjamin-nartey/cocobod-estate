import { useQuery } from '@tanstack/react-query';
import {
  getProperty,
  getPropertyUnitsForProperty,
  getReferences,
} from '../../http/properties';
import { axiosInstance } from '../../axios/axiosInstance';

export const useGetPropertyUnitsForProperty = (propertyUnitId) => {
  return useQuery({
    queryKey: ['getPropertyUnitsForProperty'],
    queryFn: () => {
      return getPropertyUnitsForProperty(propertyUnitId);
    },
  });
};

export const useGetPaginatedProperties = (queryParams) => {
  return useQuery({
    queryKey: ['getAllProperties'],
    queryFn: () => {
      return getPaginatedProperties(queryParams);
    },
  });
};

export const useGetProperty = (id) => {
  return useQuery({
    queryKey: ['getProperty'],
    queryFn: () => getProperty(id),
  });
};

export const useGetReferences = () => {
  return useQuery({
    queryKey: ['getReferences-all'],
    queryFn: () => getReferences(),
  });
};
