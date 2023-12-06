import { useQuery } from '@tanstack/react-query';
import { getAllRegions } from '../../http/regions';

export const useGetRegions = () => {
  return useQuery({
    queryKey: ['getRegions'],
    queryFn: () => {
      return getAllRegions();
    },
  });
};
