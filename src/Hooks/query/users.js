import { useQuery } from '@tanstack/react-query';
import { getEnumerators } from '../../http/users';

export const useGetEnumeartors = () => {
  return useQuery({
    queryKey: ['getEnumerators'],
    queryFn: getEnumerators,
  });
};
