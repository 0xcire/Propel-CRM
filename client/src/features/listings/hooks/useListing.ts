import { useQuery } from '@tanstack/react-query';
import { getListing } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '../types';

export const useListing = (id: number): UseQueryResult<Listings, unknown> => {
  return useQuery({
    queryKey: ['listings', { id: id }],
    queryFn: () => getListing(id),
    select: (data) => data.listings,
  });
};
