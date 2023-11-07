import { useQuery } from '@tanstack/react-query';
import { searchListings } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '../types';

export const useSearchListings = (): UseQueryResult<Listings, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const address = searchParams.get('address');
  const status = searchParams.get('status');
  const query = {
    address: address,
    status: status,
    search: true,
  };
  return useQuery({
    queryKey: ['listings', query],
    queryFn: searchListings,
    select: (data) => data.listings,
    enabled: !!query.address,
  });
};
