import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContact } from '../api';
import { useToast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { NewContact, ContactResponse } from '../types';

export const useCreateContact = (): UseMutationResult<
  ContactResponse,
  unknown,
  NewContact,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      queryClient.invalidateQueries(['contacts']);
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
