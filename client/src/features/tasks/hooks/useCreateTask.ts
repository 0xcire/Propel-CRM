import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { NewTask, TaskResponse } from '../types';

export const useCreateTask = (): UseMutationResult<
  TaskResponse,
  unknown,
  NewTask,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      queryClient.invalidateQueries(['tasks', { completed: 'false' }]);
    },

    onError: (error) => {
      if (isAPIError(error)) {
        toast({
          description: `${error.message}`,
        });
      }
    },
  });
};
