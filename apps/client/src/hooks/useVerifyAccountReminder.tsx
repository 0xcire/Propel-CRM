import { useEffect } from 'react';

import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

import { useUser } from '@/lib/react-query-auth';
import { useRequestVerificationEmail } from '@/features/users/hooks/useRequestVerificationEmail';

const _5_MIN = 300000;

export const useVerifyAccountReminder = (): void => {
  const user = useUser();
  const { toast } = useToast();
  const { mutate } = useRequestVerificationEmail();

  useEffect(() => {
    if (user.data?.isVerified) return;
    const timeout = setTimeout(() => {
      toast({
        title: 'Account Verification',
        description: "We noticed you haven't verified your email yet.",
        action: (
          <ToastAction
            onClick={(): void => mutate(user.data?.id as number)}
            altText='Verify Email'
          >
            Verify Now
          </ToastAction>
        ),
      });
    }, _5_MIN);

    return () => {
      clearTimeout(timeout);
    };
  }, [mutate, toast, user.data]);
};
