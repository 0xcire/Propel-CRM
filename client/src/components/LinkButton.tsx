import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import type { ButtonHTMLAttributes } from 'react';

interface LinkButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  path: string;
  className: string;
}

export function LinkButton({
  text,
  path,
  className,
  ...props
}: LinkButtonProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <Button
      {...props}
      className={className}
      onClick={(): void => navigate(path)}
    >
      {text}
    </Button>
  );
}
