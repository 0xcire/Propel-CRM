import { useQuery } from '@tanstack/react-query';
import { getContactTasks } from '../api';

import { getTaskQueryParams } from '../utils';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useContactTasks = (
  contactID: number
): UseQueryResult<Tasks, unknown> => {
  const query = getTaskQueryParams();

  return useQuery({
    queryKey: ['tasks', { contactID: contactID, ...query }],
    queryFn: () => getContactTasks(contactID),
    select: (data) => data.tasks,
  });
};
