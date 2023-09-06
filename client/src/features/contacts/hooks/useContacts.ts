import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getContacts } from '../api';

import type { Contacts } from '../types';

export const useContacts = (): UseQueryResult<Contacts, unknown> => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
    select: (data) => data.contacts,
  });
};
