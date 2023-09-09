import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { getSalesVolumeData } from '../api';

import type { SalesVolume } from '../types';

export const useSalesVolume = (): UseQueryResult<SalesVolume, unknown> => {
  return useQuery({
    queryKey: ['sales-volume'],
    queryFn: getSalesVolumeData,
    select: (data) => data.analytics,
  });
};
