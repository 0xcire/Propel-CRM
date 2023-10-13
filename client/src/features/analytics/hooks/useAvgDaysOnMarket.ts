import { useQuery } from '@tanstack/react-query';

import { getAvgDaysOnMarket } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';

export const useAvgDaysOnMarket = (
  userID: number
): UseQueryResult<string, unknown> => {
  return useQuery({
    queryKey: ['avg-days-on-market', { userID: userID }],
    queryFn: () => getAvgDaysOnMarket(userID),
    select: (data) => data.average,
  });
};
