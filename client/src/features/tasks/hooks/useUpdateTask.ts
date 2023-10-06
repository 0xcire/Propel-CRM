import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { UseMutationResult } from '@tanstack/react-query';
import type { TaskContext, TaskResponse, UpdateTaskParams } from '../types';
// import { findRelevantKeys } from '@/lib/react-query';

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
      // const keys = findRelevantKeys(queryClient, 'tasks', id);
      toast({
        description: data.message,
      });

      queryClient.invalidateQueries(['tasks']);

      // TODO: ensure this works correctly
      // way to differentiate checkbox action vs actual update task form

      // keys.forEach((key) => {
      //   queryClient.invalidateQueries(key, {
      //     refetchType: 'none',
      //   });
      // });
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
