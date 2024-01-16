import { useQuery } from '@tanstack/react-query';
import {
  getAllDepartments,
  getDepartmentByDivisionId,
} from '../../http/department';

export const useGetAllDepartments = () => {
  return useQuery({
    queryKey: ['getAllDepartments'],
    queryFn: () => {
      return getAllDepartments();
    },
  });
};
export const useGetDepartmentByDivisionId = (divisionId, options = {}) => {
  return useQuery({
    queryKey: ['getDepartmentByDivisionId', divisionId],
    queryFn: () => getDepartmentByDivisionId(divisionId),
    ...options,
  });
};
