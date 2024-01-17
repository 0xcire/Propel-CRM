import { useNavigate } from 'react-router-dom';

import { twMerge } from 'tailwind-merge';

import { LucideChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

export function BackButton({ className }: { className?: string }): JSX.Element {
  const navigate = useNavigate();
  return (
    <Button
      variant='secondary'
      size='icon'
      className={twMerge('h-9 w-16', className)}
      onClick={(): void => navigate(-1)}
    >
      <LucideChevronLeft
        size={20}
        className='mt-[1px]'
      />
      <span className='mr-[6px]'>Back</span>
    </Button>
  );
}
