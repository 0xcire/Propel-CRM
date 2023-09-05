import { type UseQueryResult, useQuery } from '@tanstack/react-query';

import { getSalesYearsData } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';
import type { Years } from '../types';

export const useSalesYears = (): UseQueryResult<Years, unknown> => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['sales-years'],
    queryFn: getSalesYearsData,
    select: (data) => data.years,

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
