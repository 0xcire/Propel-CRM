import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { UseMutationResult } from '@tanstack/react-query';
import type { TaskResponse, Tasks } from '../types';

export const useDeleteTask = (): UseMutationResult<
  TaskResponse,
  unknown,
  number,
  {
    previousTasks: Tasks;
  }
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,

    onMutate: async (deletedTaskID) => {
      await queryClient.cancelQueries(['tasks', { completed: 'false' }]);

      // TODO: common logic. extract
      const { tasks: previousTasks } = queryClient.getQueryData([
        'tasks',
        { completed: 'false' },
      ]) as TaskResponse;

      const optimisticTasks = previousTasks.filter(
        (task) => task.id !== deletedTaskID
      );

      // TODO: common logic. extract
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

    onError: (error, deletedTaskID, context) => {
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
