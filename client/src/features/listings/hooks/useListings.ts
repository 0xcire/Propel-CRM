import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getListings } from '../api';

import type { Listings } from '../types';

export const useListings = (): UseQueryResult<Listings, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  return useQuery({
    queryKey: [
      'listings',
      { page: searchParams.get('page'), status: searchParams.get('status') },
    ],
    queryFn: () => getListings(),
    select: (data) => data.listings,
    keepPreviousData: true,
  });
};
