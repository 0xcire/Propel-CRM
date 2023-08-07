import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { createTask } from '../api';
import { queryClient } from '@/lib/react-query';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';
import type { NewTask, TaskResponse } from '../types';

export const useCreateContact = (): UseMutationResult<
  TaskResponse,
  unknown,
  Partial<NewTask>,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: createTask,
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
