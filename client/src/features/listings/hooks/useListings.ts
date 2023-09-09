import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getListings } from '../api';

import type { Listings } from '../types';

export const useListings = (): UseQueryResult<Listings, unknown> => {
  return useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
    select: (data) => data.listings,
  });
};
