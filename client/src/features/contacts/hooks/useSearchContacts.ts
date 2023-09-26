import { useQuery } from '@tanstack/react-query';
import { searchContacts } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Contacts } from '../types';

// TODO:
// need to differentiate between AddLead and Contacts Table
// add lead should return name and id
// contacts table should return everything

export const useSearchContacts = (): UseQueryResult<
  Contacts | undefined,
  unknown
> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = { name: searchParams.get('name') };

  return useQuery({
    queryKey: ['contacts', query],
    queryFn: searchContacts,
    select: (data) => data?.contacts,
    enabled: !!query.name,
  });
};
