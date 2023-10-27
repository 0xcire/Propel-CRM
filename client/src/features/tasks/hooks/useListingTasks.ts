import { useQuery } from '@tanstack/react-query';
import { getListingTasks } from '../api';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useListingTasks = (
  listingID: number
): UseQueryResult<Tasks, unknown> => {
  const searchParams = new URLSearchParams(window.location.search);
  const query = {
    page: searchParams.get('page'),
    completed: searchParams.get('completed'),
    priority: searchParams.get('priority'),
  };

  return useQuery({
    queryKey: ['tasks', { listingID: listingID, ...query }],
    queryFn: () => getListingTasks(listingID),
    select: (data) => data.tasks,
  });
};
