import { useQuery } from '@tanstack/react-query';
import { getContact } from '../api';
import { Contacts } from '../types';

import type { UseQueryResult } from '@tanstack/react-query';

export const useContact = (id: number): UseQueryResult<Contacts, unknown> => {
  return useQuery({
    queryKey: ['contacts', { id: id }],
    queryFn: () => getContact(id),
    select: (data) => data.contacts,
  });
};
