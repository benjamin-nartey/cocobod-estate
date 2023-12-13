import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../../http/dashboard';

export const useGetDashboard = () => {
  return useQuery({
    queryKey: ['dashbaord'],
    queryFn: getDashboardData,
  });
};
