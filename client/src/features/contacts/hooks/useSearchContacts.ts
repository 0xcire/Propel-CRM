import { useQuery } from '@tanstack/react-query';
import { searchContacts } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Contacts } from '../types';

export const useSearchContacts = (): UseQueryResult<
  Contacts | undefined,
  unknown
> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = { name: searchParams.get('name'), search: true };

  return useQuery({
    queryKey: ['contacts', query],
    queryFn: searchContacts,
    select: (data) => data?.contacts,
    enabled: !!query.name,
  });
};
