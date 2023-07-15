import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

type LinkButtonProps = {
  text: string;
  path: string;
  className?: string;
};

export function LinkButton({
  text,
  path,
  className,
}: LinkButtonProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <Button
      className={className}
      onClick={(): void => navigate(path)}
    >
      {text}
    </Button>
  );
}
