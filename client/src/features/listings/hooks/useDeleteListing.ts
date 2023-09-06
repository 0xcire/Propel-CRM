import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';
import type { ListingResponse } from '../types';

export const useDeleteListing = (): UseMutationResult<
  ListingResponse,
  unknown,
  number,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      return queryClient.invalidateQueries({
        queryKey: ['listings'],
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
