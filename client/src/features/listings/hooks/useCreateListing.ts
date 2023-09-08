import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, Listings, NewListing } from '../types';

export const useCreateListing = (): UseMutationResult<
  ListingResponse,
  unknown,
  NewListing,
  {
    previousListings: Listings;
  }
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createListing,

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      queryClient.invalidateQueries(['listings']);
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
