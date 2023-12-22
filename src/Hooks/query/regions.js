import { useQuery } from '@tanstack/react-query';
import { getAllRegions } from '../../http/regions';
import { getDistrictsByRegionId } from '../../http/district';

export const useGetRegions = () => {
  return useQuery({
    queryKey: ['getRegions'],
    queryFn: () => {
      return getAllRegions();
    },
  });
};

export const useGetDistrictByRegionId = (regionId) => {
  return useQuery({
    queryKey: ['getDistrictByRegionId'],
    queryFn: () => {
      return getDistrictsByRegionId(regionId);
    },
    enabled: false,
  });
};
