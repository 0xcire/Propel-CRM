import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { updateAccount } from '../api';
import { isAPIError } from '@/utils/error';
import { useToast } from '@/components/ui/use-toast';

import type { UpdateAccountParams } from '../types';
import type { UserResponse } from '@/types';

export const useUpdateAccount = (): UseMutationResult<
  UserResponse,
  unknown,
  UpdateAccountParams,
  unknown
> => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
  });
};
