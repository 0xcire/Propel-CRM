import { useMutation, useQueryClient } from '@tanstack/react-query';

import { markListingAsSold } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, SoldListing } from '../types';

export const useMarkListingAsSold = (): UseMutationResult<
  ListingResponse,
  unknown,
  SoldListing,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markListingAsSold,

    onSuccess: (data) => {
      toast({
        description: data.message,
      });

      queryClient.invalidateQueries(['listings'], {
        exact: false,
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
