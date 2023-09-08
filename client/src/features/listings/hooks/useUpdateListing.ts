import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { Dispatch, SetStateAction } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, UpdateListingParams } from '../types';

export const useUpdateListing = (
  setOpen: Dispatch<SetStateAction<boolean>>
): UseMutationResult<
  ListingResponse,
  unknown,
  UpdateListingParams,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateListing,

    onMutate: async (updateData) => {
      await queryClient.cancelQueries(['listings']);

      setOpen(false);

      const updatedListing = {
        ...updateData.data,
        id: updateData.id,
      };

      const { listings: previousListings } = queryClient.getQueryData([
        'listings',
      ]) as ListingResponse;

      const optimisticListings = previousListings.map((listing) => {
        return listing.id === updatedListing.id ? updatedListing : listing;
      });

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

    onError: (error, updateData, previousListings) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }

      queryClient.setQueryData(['listings'], () => {
        return {
          message: '',
          listings: previousListings,
        };
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries(['listings']);
    },
  });
};
