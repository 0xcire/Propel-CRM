import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getContacts } from '../api';

import type { Contacts } from '../types';

export const useContacts = (): UseQueryResult<
  Contacts | undefined,
  unknown
> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = { page: searchParams.get('page') ?? '1' };
  return useQuery({
    queryKey: ['contacts', query],
    queryFn: getContacts,
    select: (data) => data.contacts,
    // refetchOnMount
  });
};
