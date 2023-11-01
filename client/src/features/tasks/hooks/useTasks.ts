import { useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';

import { getTaskQueryParams } from '../utils';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useTasks = (): UseQueryResult<Tasks, unknown> => {
  const query = getTaskQueryParams();

  return useQuery({
    queryKey: ['tasks', query],
    queryFn: getTasks,
    select: (data) => data.tasks,
  });
};
