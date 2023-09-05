import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { updateContact } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { ContactResponse, UpdateContactParams } from '../types';

export const useUpdateContact = (): UseMutationResult<
  ContactResponse,
  unknown,
  UpdateContactParams,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContact,
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
