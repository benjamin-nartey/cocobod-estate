import { useQuery } from '@tanstack/react-query';
import { getAllDeployments, getAllocation } from '../../http/deployment';

export const useGetAllDeployments = () => {
  return useQuery({
    queryKey: ['getAllDeployments'],
    queryFn: getAllDeployments,
  });
};

export const useGetAllocation = (id, pageNum) => {
  return useQuery({
    queryKey: ['getAllocation', id],
    queryFn: () => {
      return getAllocation(id, pageNum);
    },
  });
};
