import { useQuery } from '@tanstack/react-query';

import { getTownByDistrictId } from '../../http/town';

export const useGetLocation = (path) => {
  return useQuery({
    queryKey: ['getLocation', path],
    queryFn: () => getLocation(path),
  });
};

export const useGetLocationByDisrictId = (districtId) => {
  return useQuery({
    queryKey: ['getLocation', districtId],
    queryFn: () => {
      return getTownByDistrictId(districtId);
    },
    enabled: false,
  });
};
