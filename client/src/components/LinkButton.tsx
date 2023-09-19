import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

import type { ButtonProps } from './ui/button';

interface LinkButtonProps extends ButtonProps {
  text: string;
  path?: string;
  delta?: number;
  className?: string;
}

export function LinkButton({
  text,
  path,
  delta,
  className,
  ...props
}: LinkButtonProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <Button
      {...props}
      className={className}
      onClick={(): void => {
        path ? navigate(path) : navigate(delta as number);
      }}
    >
      {text}
    </Button>
  );
}
