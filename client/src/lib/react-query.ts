import { toast } from '@/components/ui/use-toast';
import { isAPIError } from '@/utils/error';
import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    // TODO: implement react query auth myself to revert this comment
    // onError: (error) => {
    //   if (isAPIError(error)) {
    //     return toast({
    //       description: `${error.message}`,
    //     });
    //   }
    // },
    useErrorBoundary: (error) => isAPIError(error) && error.status >= 500,
  },
  mutations: {
    onError: (error) => {
      if (isAPIError(error)) {
        return toast({
          description: `${error.message}`,
        });
      }
    },
    useErrorBoundary: (error) => isAPIError(error) && error.status >= 500,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
