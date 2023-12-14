import { useSnapshot } from 'valtio';
import { getReport } from '../../http/report';
import state from '../../store/store';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { message } from 'antd';

export const useGetReport = (pageNum) => {
  const snap = useSnapshot(state);
  const { reportFilters } = snap.modalSlice;

  return useQuery({
    queryKey: ['getReport', pageNum],
    queryFn: () => {
      return getReport({ pageNum, ...reportFilters });
    },
    enabled: false,
  });
};
