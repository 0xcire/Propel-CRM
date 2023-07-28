import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import {
  type UserResponse,
  updateAccount,
  type UpdateAccountOptions,
} from '../api';
import { queryClient } from '@/lib/react-query';
import { isAPIError } from '@/utils/error';
import { useToast } from '@/components/ui/use-toast';
import { APIError } from '@/lib/fetch';

export const useUpdateAccount = (): UseMutationResult<
  UserResponse | APIError,
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
