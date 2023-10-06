import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useTasks = (): UseQueryResult<Tasks, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = {
    page: searchParams.get('page'),
    completed: searchParams.get('completed'),
  };
  
  return useQuery({
    queryKey: ['tasks', query],
    queryFn: getTasks,
    select: (data) => data.tasks,
  });
};
