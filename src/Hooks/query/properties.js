import { useQuery } from '@tanstack/react-query';
import { getPropertyUnitsForProperty } from '../../http/properties';

export const useGetPropertyUnitsForProperty = (propertyId) => {
  return useQuery({
    queryKey: ['getPropertyUnitsForProperty'],
    queryFn: () => {
      return getPropertyUnitsForProperty(propertyId);
    },
  });
};
