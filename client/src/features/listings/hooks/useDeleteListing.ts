import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { UseMutationResult } from '@tanstack/react-query';
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
    onMutate: async (deletedListingID) => {
      await queryClient.cancelQueries(['listings']);

      const { listings: previousListings } = queryClient.getQueryData([
        'listings',
      ]) as ListingResponse;

      const optimisticListings = previousListings.filter(
        (listing) => listing.id !== deletedListingID
      );

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
    onError: (error, deletedListingID, context) => {
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
