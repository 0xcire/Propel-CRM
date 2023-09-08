import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { Dispatch, SetStateAction } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { TaskResponse, UpdateTaskParams } from '../types';

export const useUpdateTask = (
  setOpen: Dispatch<SetStateAction<boolean>>
): UseMutationResult<TaskResponse, unknown, UpdateTaskParams, unknown> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,

    onMutate: async (updateData) => {
      await queryClient.cancelQueries(['tasks', { completed: 'false' }]);

      setOpen(true);

      const updatedTask = {
        id: updateData.id,
        ...updateData.data,
      };

      const { tasks: previousTasks } = queryClient.getQueryData([
        'tasks',
        { completed: 'false' },
      ]) as TaskResponse;

      const optimisticTasks = previousTasks.map((task) => {
        return task.id === updatedTask.id ? updatedTask : task;
      });

      queryClient.setQueryData(['tasks', { completed: 'false' }], () => {
        return {
          message: '',
          listings: optimisticTasks,
        };
      });

      return { previousTasks };
    },

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },

    onError: (error, updateData, context) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }

      queryClient.setQueryData(['tasks', { completed: 'false' }], () => {
        return {
          message: '',
          listings: context?.previousTasks,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(['tasks', { completed: 'false' }]);
    },
  });
};
