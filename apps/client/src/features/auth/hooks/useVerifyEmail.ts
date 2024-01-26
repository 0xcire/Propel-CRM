import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@/lib/react-query-auth';
import { verifyEmail } from '../api';

import { useToast } from '@/components/ui/use-toast';

import type { UseMutationResult } from '@tanstack/react-query';

import type { BaseResponse } from '@/types';

export const useVerifyEmail = (): UseMutationResult<
  BaseResponse,
  unknown,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useUser();
  const { toast } = useToast();
  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      if (user.data !== null) {
        navigate('/dashboard');
        queryClient.invalidateQueries(['user']);
      } else {
        navigate('/auth/signin');
      }

      toast({
        title: 'Thank you!',
        description: data.message,
      });
    },
    onError: () => null,
  });
};
