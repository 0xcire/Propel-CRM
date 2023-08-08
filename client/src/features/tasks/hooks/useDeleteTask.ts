import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { deleteTask } from '../api';
import { queryClient } from '@/lib/react-query';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { TaskResponse } from '../types';

export const useDeleteTask = (): UseMutationResult<
  TaskResponse,
  unknown,
  number,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      return queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    },
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
