import { useQuery } from '@tanstack/react-query';

import { getSalesYearsData } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Years } from '../types';

export const useSalesYears = (
  userID: number
): UseQueryResult<Years, unknown> => {
  return useQuery({
    queryKey: ['sales-years', { userID: userID }],
    queryFn: () => getSalesYearsData(userID),
    select: (data) => data.years,
  });
};
