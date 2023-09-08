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
    onMutate: async (updatedContact) => {
      await queryClient.cancelQueries(['contacts']);

      setOpen(false);

      const updatedData = {
        ...updatedContact.data,
        id: updatedContact.id,
      };

      const { contacts: previousContacts } = queryClient.getQueryData([
        'contacts',
      ]) as ContactResponse;

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
      // });

      // TODO: type Contact should not be optional.
      queryClient.setQueryData(
        ['contacts'],
        (old: ContactResponse | undefined) => {
          return {
            message: '',
            contacts: old?.contacts?.map((contact) => {
              return contact.id === updatedData.id ? updatedData : contact;
            }),
          };
        }
      );

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
