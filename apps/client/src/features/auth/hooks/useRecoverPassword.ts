import { useMutation } from '@tanstack/react-query';
import { recoverPassword } from '../api';

import { useToast } from '@/components/ui/use-toast';

import { RecoveryFields } from '../components/RecoveryForm';

import type { UseMutationResult } from '@tanstack/react-query';
import type { BaseResponse } from '@/types';

export const useRecoverPassword = (): UseMutationResult<
  BaseResponse,
  unknown,
  RecoveryFields,
  unknown
> => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: recoverPassword,
    onSuccess: (data) => {
      toast({
        title: 'Account Recovery',
        description: data.message,
      });
    },
  });
};
