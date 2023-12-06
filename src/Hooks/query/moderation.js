import { useQuery } from '@tanstack/react-query';
import { getRegionalPropertyCount } from '../../http/moderation';

export const useGetRegionalPropertiesCount = () => {
  return useQuery({
    queryKey: ['getRegionalPropertiesCount'],
    queryFn: getRegionalPropertyCount,
  });
};
