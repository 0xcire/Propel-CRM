import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { Dispatch, SetStateAction } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { Task, TaskResponse, Tasks } from '../types';

export const useCreateTask = (
  setOpen: Dispatch<SetStateAction<boolean>>
): UseMutationResult<
  TaskResponse,
  unknown,
  Task,
  {
    previousTasks: Tasks;
  }
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,

    onMutate: async (newTask) => {
      await queryClient.cancelQueries(['tasks', { completed: 'false' }]);

      setOpen(false);

      // TODO: if i extract this out to common hook, can maybe remove type cast
      // and then use NewTask instead of Task
      const { tasks: previousTasks } = queryClient.getQueryData([
        'tasks',
        { completed: 'false' },
      ]) as TaskResponse;

      const optimisticTasks = previousTasks.map((task) => task);
      optimisticTasks.unshift(newTask);

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

    onError: (error, task, context) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
      queryClient.setQueryData(['tasks', { completed: 'false' }], {
        message: '',
        listings: context?.previousTasks,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(['tasks', { completed: 'false' }]);
    },
  });
};
