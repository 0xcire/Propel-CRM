import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeLead } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/';

import type { UseMutationResult } from '@tanstack/react-query';
import type { ListingResponse, ListingLeadParams } from '../types';

export const useRemoveLead = (): UseMutationResult<
  ListingResponse,
  unknown,
  ListingLeadParams,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchParams = new URLSearchParams(window.location.search);
  const query = {
    page: searchParams.get('page'),
    status: searchParams.get('status'),
  };

  return useMutation({
    mutationFn: removeLead,
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      // TODO: verify this works correctly
      queryClient.invalidateQueries(['listings', query]);
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
