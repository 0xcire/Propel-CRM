import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContact } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';

import type { Dispatch, SetStateAction } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { NewContact, ContactResponse } from '../types';

export const useCreateContact = (
  setOpen: Dispatch<SetStateAction<boolean>>
): UseMutationResult<ContactResponse, unknown, NewContact, unknown> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onMutate: async (newContact) => {
      await queryClient.cancelQueries(['contacts']);

      setOpen(false);

      const { contacts: previousContacts } = queryClient.getQueryData([
        'contacts',
      ]) as ContactResponse;

      const optimisticContacts = previousContacts.map((contact) => contact);
      optimisticContacts.unshift(newContact);

      queryClient.setQueryData(['contacts'], () => {
        return {
          message: '',
          contacts: optimisticContacts,
        };
      });

      return { previousContacts };
    },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
    onError: (error, newContact, context) => {
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
