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

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      queryClient.invalidateQueries(['contacts']);
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
