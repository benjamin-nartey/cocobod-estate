import { useQuery } from '@tanstack/react-query';
import { getAllTowns } from '../../http/town';

export const useGetAllTowns = () => {
  return useQuery({
    queryKey: ['towns'],
    queryFn: getAllTowns,
  });
};
