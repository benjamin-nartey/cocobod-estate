import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../../http/roles';

export const useGetRoles = () => {
  return useQuery({
    queryKey: ['getRoles'],
    queryFn: getRoles,
  });
};
