import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
  // mutations: {

  // },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
