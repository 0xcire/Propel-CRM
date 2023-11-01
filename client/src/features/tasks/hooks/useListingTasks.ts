import { useQuery } from '@tanstack/react-query';
import { getListingTasks } from '../api';

import { getTaskQueryParams } from '../utils';

import type { UseQueryResult } from '@tanstack/react-query';
import type { Tasks } from '../types';

export const useListingTasks = (
  listingID: number
): UseQueryResult<Tasks, unknown> => {
  const query = getTaskQueryParams();

  return useQuery({
    queryKey: ['tasks', { listingID: listingID, ...query }],
    queryFn: () => getListingTasks(listingID),
    select: (data) => data.tasks,
  });
};
