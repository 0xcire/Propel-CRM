import { useMutation, useQueryClient } from '@tanstack/react-query';
import { findRelevantKeys } from '@/lib/react-query';

import { updateListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, UpdateListingParams } from '../types';

export const useUpdateListing = (): UseMutationResult<
  ListingResponse,
  unknown,
  UpdateListingParams,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateListing,

    onSuccess: (data, { id }) => {
      const keys = findRelevantKeys(queryClient, 'listings', id);
      toast({
        description: data.message,
      });

      keys.forEach((key) => {
        queryClient.invalidateQueries(key);
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
