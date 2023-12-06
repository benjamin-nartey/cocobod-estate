import { useQuery } from '@tanstack/react-query';
import { getLocation } from '../../http/regions';

export const useGetLocation = (path) => {
  return useQuery({
    queryKey: ['getLocation', path],
    queryFn: () => getLocation(path),
  });
};
