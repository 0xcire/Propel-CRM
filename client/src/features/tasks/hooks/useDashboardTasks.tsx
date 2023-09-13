import { useQuery } from '@tanstack/react-query';
import { getDashboardTasks } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useDashboardTasks = (
  completed: string
): UseQueryResult<Tasks, unknown> => {
  return useQuery({
    queryKey: ['tasks', { completed: completed, dashboard: true }],
    queryFn: () => getDashboardTasks(completed),
    select: (data) => data.tasks,
  });
};
