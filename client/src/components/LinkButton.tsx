import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

type LinkButtonProps = {
  text: string;
  path: string;
  className?: string;
};

export function LinkButton({ text, path, className }: LinkButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      className={className}
      onClick={() => navigate(path)}
    >
      {text}
    </Button>
  );
}
