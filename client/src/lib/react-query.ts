// eslint-disable-next-line
// @ts-nocheck -> React Query typing = unknown. QueryKey params could be anything. remove when adding to file and ignore queryKey[1] object unknown errors

import { QueryCache, QueryClient } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/';

import type { DefaultOptions, QueryKey } from '@tanstack/react-query';

const handleApiError = (error: unknown): void => {
  if (isAPIError(error)) {
    if (error.status === 403) {
      queryClient.setQueryData(['user'], null);
    } else {
      toast({
        description: `${error.message}`,
      });
    }
  }

  return;
};

const isServerError = (error: unknown): boolean =>
  isAPIError(error) && error.status >= 500;

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    useErrorBoundary: (error) => isServerError(error),
  },
  mutations: {
    onError: (error) => handleApiError(error),
    useErrorBoundary: (error) => isServerError(error),
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
  queryCache: new QueryCache({
    // recommended use of onError for tanstack v5, have yet to upgrade...
    onError: (error): void => handleApiError(error),
  }),
});

// can only use on update, create / delete cause shift in paginated data
export const findRelevantKeys = (
  queryClient: QueryClient,
  contextKey: string,
  id: number
): Array<QueryKey> => {
  const cache = queryClient.getQueryCache();
  const relevantCachedKeys = cache.findAll([contextKey]);

  if (relevantCachedKeys.length === 1 && relevantCachedKeys[0]) {
    return [relevantCachedKeys[0].queryKey];
  }

  const searchParams = new URLSearchParams(window.location.search);
  const relevantSearchParams = [
    searchParams.get('name'),
    searchParams.get('title'),
    searchParams.get('address'),
  ];

  const keys: Array<QueryKey> = [];

  for (const { queryKey } of relevantCachedKeys) {
    if (queryKey[1].id && queryKey[1].id === id) {
      keys.push(queryKey);
    }

    if (!searchParams.get(contextKey) && queryKey[1].page) {
      const cachedData = queryClient.getQueryData(queryKey);

      if (cachedData) {
        if (
          cachedData[contextKey].some((data) => data.id === +(id as string))
        ) {
          keys.push(queryKey);
        }
      }
    }

    relevantSearchParams.forEach((searchParam) => {
      if (
        searchParam &&
        queryKey[1][searchParam] &&
        queryKey[1][searchParam] === searchParam
      ) {
        keys.push(queryKey);
      }
    });
  }
  return keys;
};
