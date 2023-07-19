import type { ButtonHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
      className='max-w-content'
      type='submit'
    >
      {isLoading && <Spinner variant='xs' />}
      {text}
    </Button>
  );
};
