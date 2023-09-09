import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';

import type { Tasks } from '../types';

export const useTasks = (completed: string): UseQueryResult<Tasks, unknown> => {
  return useQuery({
    queryKey: ['tasks', { completed: completed }],
    queryFn: () => getTasks(completed),
    select: (data) => data.tasks,
  });
};
