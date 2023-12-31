import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

import type { PropsWithChildren } from 'react';
import type { ButtonProps } from './ui/button';

interface LinkButtonProps extends ButtonProps, PropsWithChildren {
  path?: string;
  delta?: number;
  className?: string;
}

export function LinkButton({
  path,
  delta,
  children,
  className,
  ...props
}: LinkButtonProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <Button
      {...props}
      className={className}
      onClick={(e): void => {
        e.stopPropagation();
        path ? navigate(path) : navigate(delta as number);
      }}
    >
      {children}
    </Button>
  );
}
