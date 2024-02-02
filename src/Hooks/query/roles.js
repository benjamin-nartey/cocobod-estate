import { useQuery } from '@tanstack/react-query';
import { getPermissions, getRoles } from '../../http/roles';

export const useGetRoles = () => {
  return useQuery({
    queryKey: ['getRoles'],
    queryFn: getRoles,
  });
};

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ['getPermissions'],
    queryFn: getPermissions,
  });
};
