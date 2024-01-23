import { useMutation } from '@tanstack/react-query';
import { updateAccountFromRecovery } from '../api';

import { useToast } from '@/components/ui/use-toast';

import type { UseMutationResult } from '@tanstack/react-query';
import type { UpdateAccountFromRecoveryParams } from '../types';
import type { BaseResponse } from '@/types';

export const useUpdateAccountFromRecovery = (): UseMutationResult<
  BaseResponse,
  unknown,
  UpdateAccountFromRecoveryParams,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateAccountFromRecovery,
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
  });
};
