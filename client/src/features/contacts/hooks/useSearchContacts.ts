import { useQuery } from '@tanstack/react-query';
import { searchContacts } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { AddLead, Contacts } from '../types';

export const useSearchContacts = ({
  addLead,
}: AddLead): UseQueryResult<Contacts | undefined, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');

  return useQuery({
    queryKey: [
      'contacts',
      { name: name, page: page, limit: limit, search: true, addLead: addLead },
    ],
    queryFn: () => searchContacts({ addLead: addLead }),
    select: (data) => data?.contacts,
    enabled: !!name,
  });
};
