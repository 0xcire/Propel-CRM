import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { getSalesVolumeData } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { SalesVolume } from '../types';

// TODO: add filter params to queryKey
export const useSalesVolume = (): UseQueryResult<SalesVolume, unknown> => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['sales-volume'],
    queryFn: getSalesVolumeData,
    select: (data) => data.analytics,

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
