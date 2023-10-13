import { useQuery } from '@tanstack/react-query';

import { getSalesVolumeData } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { SalesVolume } from '../types';

export const useSalesVolume = (
  userID: number
): UseQueryResult<SalesVolume, unknown> => {
  return useQuery({
    queryKey: ['sales-volume', { userID: userID }],
    queryFn: () => getSalesVolumeData(userID),
    select: (data) => data.analytics,
  });
};
