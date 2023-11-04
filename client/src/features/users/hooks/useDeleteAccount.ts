import { useNavigate } from 'react-router-dom';
import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { deleteAccount } from '../api';

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], null);
      toast({
        description: `Deleted ${data.user?.username}'s account`,
      });
      navigate('/auth/signup');
    },
  });
};
