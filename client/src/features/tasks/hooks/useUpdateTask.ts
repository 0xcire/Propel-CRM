import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { updateTask } from '../api';
import { queryClient } from '@/lib/react-query';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { TaskResponse, UpdateTaskParams } from '../types';

export const useUpdateTask = (): UseMutationResult<
  TaskResponse,
  unknown,
  UpdateTaskParams,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateTask,

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
