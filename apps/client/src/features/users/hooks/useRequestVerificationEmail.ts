import { useMutation } from '@tanstack/react-query';
import { requestVerificationEmail } from '../api';

import { useToast } from '@/components/ui/use-toast';

import type { UseMutationResult } from '@tanstack/react-query';
import type { BaseResponse } from '@/types';

export const useRequestVerificationEmail = (): UseMutationResult<
  BaseResponse,
  unknown,
  number,
  unknown
> => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: requestVerificationEmail,
    onSuccess: (data) => {
      toast({
        description: data.message,
      });
    },
  });
};
