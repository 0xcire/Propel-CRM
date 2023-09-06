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
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
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
  });
};
