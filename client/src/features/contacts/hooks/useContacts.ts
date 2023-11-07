import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getContacts } from '../api';

import type { Contacts } from '../types';

export const useContacts = (): UseQueryResult<
  Contacts | undefined,
  unknown
> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
  };
  return useQuery({
    queryKey: ['contacts', query],
    queryFn: getContacts,
    select: (data) => data.contacts,
  });
};
