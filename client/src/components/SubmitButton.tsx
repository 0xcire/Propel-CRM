import { Button } from '@/components/ui/button';
import { Spinner } from '@/components';

type SubmitButtonProps = {
  text: string;
  isLoading: boolean;
  disabled?: boolean;
  ariaDisabled?: boolean;
};

export const SubmitButton = ({
  text,
  isLoading,
  disabled,
  ariaDisabled,
}: SubmitButtonProps): JSX.Element => {
  return (
    <Button
      disabled={disabled}
      aria-disabled={ariaDisabled}
      className='max-w-content'
      type='submit'
    >
      {isLoading && <Spinner variant='xs' />}
      {text}
    </Button>
  );
};
