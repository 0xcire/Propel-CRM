import { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components';
import { twMerge } from 'tailwind-merge';

interface SubmitButtonProps extends ButtonProps {
  text: string;
  isLoading: boolean;
  disabled?: boolean;
}

export const SubmitButton = ({
  text,
  isLoading,
  disabled,
  ...props
}: SubmitButtonProps): JSX.Element => {
  return (
    <Button
      {...props}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      className={twMerge('max-w-max', props.className)}
      type='submit'
    >
      {isLoading && <Spinner variant='xs' />}
      {text}
    </Button>
  );
};
