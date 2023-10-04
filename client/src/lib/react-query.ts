import { QueryClient } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

import type { DefaultOptions, QueryKey } from '@tanstack/react-query';

const handleApiError = (error: unknown): void => {
  if (isAPIError(error)) {
    // TODO: refresh
    if (error.status === 403) {
      // queryClient.setQueryData(['user'], null);
      queryClient.invalidateQueries(['user']);
    } else {
      toast({
        description: `${error.message}`,
      });
    }
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

  const keys: Array<QueryKey> = [];

  for (const { queryKey } of relevantCachedKeys) {
    // eslint-disable-next-line
    // @ts-ignore -> React Query typing = unknown. QueryKey params could be anything.
    if (queryKey[1].id && queryKey[1].id === id) {
      keys.push(queryKey);
    }

    // eslint-disable-next-line
    // @ts-ignore
    if (queryKey[1].page) {
      const cachedData = queryClient.getQueryData(queryKey);

      // eslint-disable-next-line
      // @ts-ignore
      if (cachedData[contextKey].some((data) => data.id === +(id as string))) {
        keys.push(queryKey);
      }
    }
  }
  return keys;
};
