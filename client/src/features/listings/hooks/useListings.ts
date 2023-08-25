import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { getListings } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';
import type { Listings } from '../types';

export const useListings = (): UseQueryResult<Listings, unknown> => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['listings'],
    queryFn: getListings,
    select: (data) => data.listings,

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
