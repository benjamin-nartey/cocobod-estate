import { useQuery } from '@tanstack/react-query';
import { getAllDivisions } from '../../http/division';

export const useGetAllDivisions = () => {
  return useQuery({
    queryKey: ['getAllDivisions'],
    queryFn: () => {
      return getAllDivisions();
    },
  });
};
