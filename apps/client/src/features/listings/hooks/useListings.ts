import { useQuery } from '@tanstack/react-query';
import { getListings } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '../types';

export const useListings = (): UseQueryResult<Listings, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = {
    page: searchParams.get('page'),
    status: searchParams.get('status'),
    limit: searchParams.get('limit'),
  };

  return useQuery({
    queryKey: ['listings', query],
    queryFn: getListings,
    select: (data) => data.listings,
    keepPreviousData: true,
    enabled: !!query.page && !!query.status,
  });
};
