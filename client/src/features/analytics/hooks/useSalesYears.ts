import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { getSalesYearsData } from '../api';

import type { Years } from '../types';

export const useSalesYears = (): UseQueryResult<Years, unknown> => {
  return useQuery({
    queryKey: ['sales-years'],
    queryFn: getSalesYearsData,
    select: (data) => data.years,
  });
};
