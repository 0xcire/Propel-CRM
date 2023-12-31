import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeLead } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { findRelevantKeys } from '@/lib/react-query';
import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, ListingLeadParams } from '../types';

export const useRemoveLead = (
  listingID: number
): UseMutationResult<ListingResponse, unknown, ListingLeadParams, unknown> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeLead,
    onSuccess: (data) => {
      const keys = findRelevantKeys(queryClient, 'listings', listingID);
      toast({
        description: data.message,
      });

      keys.forEach((key) => queryClient.invalidateQueries(key));
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
