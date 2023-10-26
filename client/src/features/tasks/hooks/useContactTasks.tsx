import { useQuery } from '@tanstack/react-query';
import { getContactTasks } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useContactTasks = (
  contactID: number
): UseQueryResult<Tasks, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);

  //TODO: common
  const query = {
    page: searchParams.get('page'),
    completed: searchParams.get('completed'),
    priority: searchParams.get('priority'),
  };

  return useQuery({
    queryKey: ['tasks', { contactID: contactID, ...query }],
    queryFn: () => getContactTasks(contactID),
    select: (data) => data.tasks,
  });
};
