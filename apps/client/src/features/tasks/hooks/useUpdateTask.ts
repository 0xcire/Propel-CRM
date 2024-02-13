import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findRelevantKeys } from '@/lib/react-query';

import { updateTask } from '../api';

import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { TaskContext, TaskResponse, UpdateTaskParams } from '../types';

type UseUpdateTaskProps = {
  isCheckbox?: boolean;
};

export const useUpdateTask = ({
  isCheckbox,
}: UseUpdateTaskProps): UseMutationResult<
  TaskResponse,
  unknown,
  UpdateTaskParams,
  TaskContext
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,

    onSuccess: (data, { id }) => {
      toast({
        description: data.message,
      });

      // updating task via checkbox causes shift in paginated data
      if (isCheckbox) {
        queryClient.invalidateQueries(['tasks']);
      } else {
        // just updating info, no data shift
        const keys = findRelevantKeys(queryClient, 'tasks', id);

        keys.forEach((key) => {
          queryClient.invalidateQueries(key);
        });
      }
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
