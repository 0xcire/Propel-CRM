import { type UseQueryResult, useQuery } from '@tanstack/react-query';
import { type ContactResponse, getContacts } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { isAPIError } from '@/utils/error';

export const useContacts = (): UseQueryResult<ContactResponse, unknown> => {
  const { toast } = useToast();
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,

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
