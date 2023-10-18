import { useQuery } from '@tanstack/react-query';

import { getAvgTimeToCloseLead } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { TimeToCloseData } from '../types';

export const useAvgTimeToClose = (
  userID: number
): UseQueryResult<TimeToCloseData, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const year = searchParams.get('year');

  return useQuery({
    queryKey: ['avg-time-to-close', { userID: userID, year: year }],
    queryFn: () => getAvgTimeToCloseLead(userID),
    select: (data) => data.days,
  });
};
