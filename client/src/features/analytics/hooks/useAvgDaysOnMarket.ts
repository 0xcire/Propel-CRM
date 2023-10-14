import { useQuery } from '@tanstack/react-query';

import { getAvgDaysOnMarket } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import { DaysOnMarket } from '../types';

export const useAvgDaysOnMarket = (
  userID: number
): UseQueryResult<DaysOnMarket, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const year = searchParams.get('year');

  return useQuery({
    queryKey: ['avg-days-on-market', { userID: userID, year: year }],
    queryFn: () => getAvgDaysOnMarket(userID),
    select: (data) => data.averages,
  });
};
