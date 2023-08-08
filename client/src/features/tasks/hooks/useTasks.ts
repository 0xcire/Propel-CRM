import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getTasks } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { Tasks } from '../types';

export const useTasks = (): UseQueryResult<Tasks, unknown> => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
    select: (data) => data.tasks,

    onError: (error) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
    },
    useErrorBoundary: (error) => isAPIError(error) && error.status >= 500,
  });
};
