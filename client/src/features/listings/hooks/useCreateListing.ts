import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { Dispatch, SetStateAction } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, Listings, NewListing } from '../types';

export const useCreateListing = (
  setOpen: Dispatch<SetStateAction<boolean>>
): UseMutationResult<
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

    onMutate: async (newListing) => {
      await queryClient.cancelQueries(['listings']);

      setOpen(false);

      const { listings: previousListings } = queryClient.getQueryData([
        'listings',
      ]) as ListingResponse;

      const optimisticListings = previousListings.map((listing) => listing);
      optimisticListings.unshift(newListing);

      queryClient.setQueryData(['listings'], () => {
        return {
          message: '',
          listings: optimisticListings,
        };
      });

      return { previousListings };
    },
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
    onError: (error, newListing, context) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
      queryClient.setQueryData(['listings'], {
        message: '',
        listings: context?.previousListings,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};
