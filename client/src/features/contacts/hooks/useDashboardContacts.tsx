import { useQuery } from '@tanstack/react-query';
import { getDashboardContacts } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Contacts } from '../types';

export const useDashboardContacts = (): UseQueryResult<
  Contacts | undefined,
  unknown
> => {
  return useQuery({
    queryKey: ['contacts', { dashboard: true }],
    queryFn: getDashboardContacts,
    select: (data) => data.contacts,
  });
};
