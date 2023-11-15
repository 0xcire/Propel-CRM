import { useQuery } from '@tanstack/react-query';
import { getContactListings } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Listings } from '../types';

export const useContactListings = (
  contactID: number
): UseQueryResult<Listings, unknown> => {
  return useQuery({
    queryKey: ['listings', { contactID: contactID }],
    queryFn: () => getContactListings(contactID),
    select: (data) => data.listings,
    enabled: contactID !== undefined,
  });
};
