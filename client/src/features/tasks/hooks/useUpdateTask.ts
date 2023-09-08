import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { UseMutationResult } from '@tanstack/react-query';
import type { TaskContext, TaskResponse, UpdateTaskParams } from '../types';

export const useUpdateTask = (): UseMutationResult<
  TaskResponse,
  unknown,
  UpdateTaskParams,
  TaskContext
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      queryClient.invalidateQueries(['tasks', { completed: 'false' }]);
    },

    onError: (error) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
    },
  });
};
