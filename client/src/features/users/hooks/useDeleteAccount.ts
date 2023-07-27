import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { deleteAccount } from '../api';
import { useNavigate } from 'react-router-dom';
import { queryClient } from '@/lib/react-query';
import { isAPIError } from '@/utils/error';
import { useToast } from '@/components/ui/use-toast';

export const useDeleteAccount = (): UseMutationResult<
  Response,
  unknown,
  number,
  unknown
> => {
  const navigate = useNavigate();
  const { toast } = useToast();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.setQueryData(['authenticated-user'], null);
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
