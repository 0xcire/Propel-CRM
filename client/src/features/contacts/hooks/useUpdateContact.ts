import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findRelevantKeys } from '@/lib/react-query';

import { updateContact } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
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

    onSuccess: (data, { id }) => {
      const keys = findRelevantKeys(queryClient, 'contacts', id);

      toast({
        description: data.message,
      });

      keys.forEach((key) => {
        queryClient.invalidateQueries(key, {
          refetchType: 'none',
        });
      });
    },
    onError: (error) => {
      if (isAPIError(error)) {
        toast({
          title: 'Error updating contact.',
          description: `${error.message}`,
        });
      }
    },
  });
};
