import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import { updateAccount } from '../api';
import { isAPIError } from '@/utils/error';
import { useToast } from '@/components/ui/use-toast';

import type { UpdateAccountOptions } from '../types';
import type { UserResponse } from '@/types';

export const useUpdateAccount = (): UseMutationResult<
  UserResponse,
  unknown,
  UpdateAccountOptions,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateAccount,
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
      return queryClient.invalidateQueries({
        queryKey: ['authenticated-user'],
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
