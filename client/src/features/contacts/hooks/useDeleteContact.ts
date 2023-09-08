import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteContact } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { ContactResponse } from '../types';

export const useDeleteContact = (): UseMutationResult<
  ContactResponse,
  unknown,
  number,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContact,
    onMutate: async (deletedContactID) => {
      console.log(deletedContactID);
      await queryClient.cancelQueries(['contacts']);

      const { contacts: previousContacts } = queryClient.getQueryData([
        'contacts',
      ]) as ContactResponse;

      queryClient.setQueryData(
        ['contacts'],
        (old: ContactResponse | undefined) => {
          return {
            message: '',
            contacts: old?.contacts?.filter(
              (contact) => contact.id !== deletedContactID
            ),
          };
        }
      );

      return { previousContacts };
    },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
    onError: (error, deletedContactID, context) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }

      queryClient.setQueryData(['contacts'], {
        message: '',
        contacts: context?.previousContacts,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contacts']);
    },
  });
};
