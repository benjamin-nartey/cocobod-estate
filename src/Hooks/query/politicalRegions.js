import { useQuery } from '@tanstack/react-query';
import { getAllPoliticalRegions } from '../../http/politicalRegions';

export const useGetPoliticalRegions = () => {
  return useQuery({
    queryKey: ['getPoliticalRegions'],
    queryFn: () => {
      return getAllPoliticalRegions();
    },
  });
};
