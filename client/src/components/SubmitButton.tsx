import Spinner from './Spinner';
import { Button } from './ui/button';

type SubmitButtonProps = {
  text: string;
  isLoading: boolean;
  disabled?: boolean;
  ariaDisabled?: boolean;
};

const SubmitButton = ({
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

export default SubmitButton;
