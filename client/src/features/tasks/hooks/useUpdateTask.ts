import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { updateTask } from '../api';
import { queryClient } from '@/lib/react-query';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { TaskResponse, UpdateTaskParams } from '../types';

export const useUpdateTasks = (): UseMutationResult<
  TaskResponse,
  unknown,
  UpdateTaskParams,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateTask,
    // onMutate: async (updatedContact) => {
    //   console.log(updatedContact);
    //   // await queryClient.cancelQueries({
    //   //   queryKey: ['contacts'],
    //   // });

    //   const { contacts } = queryClient.getQueryData([
    //     'contacts',
    //   ]) as ContactResponse;

    //   return { contacts, updatedContact };
    // },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      // queryClient.setQueryData(['contacts'], () => {
      //   return ctx?.contacts?.map((contact) =>
      //     contact.id === ctx.updatedContact.id ? ctx.updatedContact : contact
      //   );
      // });
      return queryClient.invalidateQueries({
        queryKey: ['contacts'],
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
