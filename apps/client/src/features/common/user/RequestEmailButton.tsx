import { useUser } from '@/lib/react-query-auth';
import { useRequestVerificationEmail } from '@/features/users/hooks/useRequestVerificationEmail';

import { ToastAction } from '@/components/ui/toast';
import { SubmitButton } from '@/components/SubmitButton';
import { ButtonProps } from '@/components/ui/button';

type RequestEmailButtonProps = {
  toastAction?: boolean;
} & ButtonProps;

export function RequestEmailButton({
  variant,
  size,
  toastAction,
}: RequestEmailButtonProps): JSX.Element {
  const user = useUser();
  const { mutate, isLoading } = useRequestVerificationEmail();

  if (toastAction) {
    return (
      <>
        <SubmitButton
          variant={variant}
          size={size}
          isLoading={isLoading}
          onClick={(): void => {
            mutate(user.data?.id as number);
          }}
          asChild
        >
          <ToastAction altText='Verify Email'>Verify Email</ToastAction>
        </SubmitButton>
      </>
    );
  }
  return (
    <SubmitButton
      variant={variant}
      size={size}
      isLoading={isLoading}
      onClick={(): void => {
        mutate(user.data?.id as number);
      }}
    >
      Verify Email
    </SubmitButton>
  );
}
