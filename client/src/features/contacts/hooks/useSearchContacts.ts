import { useQuery } from '@tanstack/react-query';
import { searchContacts } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Contacts } from '../types';

// TODO:
// need to differentiate between AddLead and Contacts Table
// add lead should return name and id
// contacts table should return everything

// AddLead => id , name
// going to be in Tasks as TagContact ? => id, name
// Contacts => everything
// ?name=aust?$select=id,name

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
