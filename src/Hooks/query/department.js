import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '../../http/depatment';

export const useGetAllDepartments = () => {
  return useQuery({
    queryKey: ['getAllDepartments'],
    queryFn: () => {
      return getAllDepartments();
    },
  });
};
