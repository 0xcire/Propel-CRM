import { useQuery } from '@tanstack/react-query';
import { getDashboardListings } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '../types';

export const useDashboardListings = (): UseQueryResult<Listings, unknown> => {
  return useQuery({
    queryKey: ['dashboard-listings'],
    queryFn: getDashboardListings,
    select: (data) => data.listings,
  });
};
