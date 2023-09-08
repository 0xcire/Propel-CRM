import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { updateContact } from '../api';
import { useToast } from '@/components/ui/use-toast';
// import { ToastAction } from '@/components/ui/toast';
import { isAPIError } from '@/utils/error';

import type { ContactResponse, UpdateContactParams } from '../types';
import { Dispatch, SetStateAction } from 'react';

export const useUpdateContact = (
  setOpen: Dispatch<SetStateAction<boolean>>
): UseMutationResult<
  ContactResponse,
  unknown,
  UpdateContactParams,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContact,
    onMutate: async (updateData) => {
      await queryClient.cancelQueries(['contacts']);

      setOpen(false);

      const updatedContact = {
        ...updateData.data,
        id: updateData.id,
      };

      const { contacts: previousContacts } = queryClient.getQueryData([
        'contacts',
      ]) as ContactResponse;

      const optimisticContacts = previousContacts.map((contact) => {
        return contact.id === updatedContact.id ? updatedContact : contact;
      });

      // TODO: figure out undo logic, pause mutation and set toast duration length

      // toast({
      //   title: `Updating ${updatedData.name}`,
      //   description: 'Undo? You can ignore this message.',
      //   action: <ToastAction altText='Undo'>Undo</ToastAction>,
      // });

      // await new Promise<void>((resolve) => {
      //   setTimeout(() => {
      //     resolve();
      //   }, 1000);
      // })

      queryClient.setQueryData(['contacts'], () => {
        return {
          message: '',
          contacts: optimisticContacts,
        };
      });

      return { previousContacts, updatedContact };
    },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
    onError: (error, updatedContact, context) => {
      if (isAPIError(error)) {
        toast({
          title: 'Error updating contact.',
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
