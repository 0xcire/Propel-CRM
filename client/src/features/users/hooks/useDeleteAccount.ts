import { useNavigate } from 'react-router-dom';
import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';

import { deleteAccount } from '../api';
import { isAPIError } from '@/utils/error';

import { useToast } from '@/components/ui/use-toast';

import type { UserResponse } from '@/types';

export const useDeleteAccount = (): UseMutationResult<
  UserResponse,
  unknown,
  number,
  unknown
> => {
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      queryClient.setQueryData(['authenticated-user'], null);
      toast({
        description: `Deleted ${data.user?.username}'s account`,
      });
      navigate('/auth/signup');
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
