import { useQuery } from '@tanstack/react-query';

import { getSalesVolumeData } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { SalesVolumes } from '../types';

export const useSalesVolume = (
  userID: number
): UseQueryResult<SalesVolumes, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const year = searchParams.get('year');

  return useQuery({
    queryKey: ['sales-volume', { userID: userID, year: year }],
    queryFn: () => getSalesVolumeData(userID),
    select: (data) => data.volumes,
  });
};
