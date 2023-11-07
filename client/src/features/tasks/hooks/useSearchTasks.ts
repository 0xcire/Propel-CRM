import { useQuery } from '@tanstack/react-query';
import { searchTasks } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useSearchTasks = (): UseQueryResult<Tasks, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const title = searchParams.get('title');
  const completed = searchParams.get('completed');
  const query = {
    title: title,
    completed: completed,
    search: true,
  };

  return useQuery({
    queryKey: ['tasks', query],
    queryFn: searchTasks,
    select: (data) => data.tasks,
    enabled: !!title,
  });
};
