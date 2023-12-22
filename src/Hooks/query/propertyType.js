import { useQuery } from '@tanstack/react-query';
import { getAllPropertyTypes } from '../../http/propertyType';

export const useGetPropertyTypes = () => {
  return useQuery({
    queryKey: ['getPropertyTypes'],
    queryFn: getAllPropertyTypes,
  });
};
