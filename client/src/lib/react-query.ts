import { QueryClient } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { DefaultOptions } from '@tanstack/react-query';

const handleApiError = (error: unknown): void => {
  if (isAPIError(error)) {
    toast({
      description: `${error.message}`,
    });
  }
};

const isServerError = (error: unknown): boolean =>
  isAPIError(error) && error.status >= 500;

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    onError: (error) => handleApiError(error),
    useErrorBoundary: (error) => isServerError(error),
  },
  mutations: {
    onError: (error) => handleApiError(error),
    useErrorBoundary: (error) => isServerError(error),
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
