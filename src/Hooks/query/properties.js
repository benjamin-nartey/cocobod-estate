import { useQuery } from '@tanstack/react-query';
import {
  getPUnitsReferences,
  getPaginatedProperties,
  getProperty,
  getPropertyUnitsForProperty,
  // getReferences,
} from '../../http/properties';
import { getPropertyReferenceUnits } from '../../http/propertyUnits';
import { getAllProperties } from '../../http/properties';

export const useGetAllProperties = () => {
  return useQuery({
    queryKey: ['getAllProperties'],
    queryFn: () => {
      return getAllProperties();
    },
  });
};

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

export const useGetReferences = (queryParams) => {
  return useQuery({
    queryKey: ['getPropertyUnitReferences', queryParams?.regionFilter],
    queryFn: () => getPropertyReferenceUnits(queryParams),
  });
};
