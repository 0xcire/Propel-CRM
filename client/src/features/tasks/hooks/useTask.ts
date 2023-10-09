import { useQuery } from '@tanstack/react-query';
import { getTask } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useTask = (id: number): UseQueryResult<Tasks, unknown> => {
  return useQuery({
    queryKey: ['tasks', { id: id }],
    queryFn: () => getTask(id),
    select: (data) => data.tasks,
  });
};
