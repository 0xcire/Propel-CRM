import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { createListing } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';
import type { ListingResponse } from '../types';
import { ListingHTMLFormInputs } from '../components/ListingForm';

export const useCreateListing = (): UseMutationResult<
  ListingResponse,
  unknown,
  ListingHTMLFormInputs,
  unknown
> => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createListing,
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
    useErrorBoundary: (error) => isAPIError(error) && error.status >= 500,
  });
};
