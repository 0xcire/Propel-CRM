import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingContext, ListingResponse } from '../types';

export const useDeleteListing = (): UseMutationResult<
  ListingResponse,
  unknown,
  number,
  ListingContext
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteListing,
    onMutate: async (deletedListingID) => {
      await queryClient.cancelQueries(['listings']);

      const listingQueryData = queryClient.getQueryData<ListingResponse>([
        'listings',
      ]);

      const previousListings = listingQueryData?.listings;

      const optimisticListings = previousListings?.filter(
        (listing) => listing.id !== deletedListingID
      );

      queryClient.setQueryData<ListingResponse>(['listings'], () => {
        return {
          message: '',
          listings: optimisticListings ?? [],
        };
      });

      return { previousListings };
    },

    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
    onError: (error, _deletedListingID, context) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
      queryClient.setQueryData(['listings'], () => {
        return {
          message: '',
          listings: context?.previousListings,
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};
