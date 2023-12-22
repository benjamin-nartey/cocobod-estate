import { useQuery } from '@tanstack/react-query';
import { getPropertyUnits } from '../../http/propertyUnits';

export const useGetPropertyUnits = (queryParams, options = {}) => {
  return useQuery({
    queryKey: ['getPropertyUnits1'],
    queryFn: () => {
      return getPropertyUnits(queryParams);
    },
    ...options,
  });
};
