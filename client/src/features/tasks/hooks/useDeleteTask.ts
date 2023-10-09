import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { TaskContext, TaskResponse } from '../types';

export const useDeleteTask = (): UseMutationResult<
  TaskResponse,
  unknown,
  number,
  TaskContext
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,

    onMutate: async (deletedTaskID) => {
      await queryClient.cancelQueries(['tasks', { completed: 'false' }]);

      const taskQueryData = queryClient.getQueryData<TaskResponse>([
        'tasks',
        { completed: 'false' },
      ]);

      const previousTasks = taskQueryData?.tasks;

      const optimisticTasks = previousTasks?.filter(
        (task) => task.id !== deletedTaskID
      );

      queryClient.setQueryData(['tasks', { completed: 'false' }], () => {
        return {
          message: '',
          tasks: optimisticTasks,
        };
      });

      return { previousTasks };
    },

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },

    onError: (error, _deletedTaskID, context) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }

      queryClient.setQueryData(['tasks', { completed: 'false' }], () => {
        return {
          message: '',
          tasks: context?.previousTasks,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(['tasks', { completed: 'false' }]);
    },
  });
};
