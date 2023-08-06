import type { ReactNode } from 'react';
import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type TooptipProps = {
  children: ReactNode;
  content: string;
};

export function Tooltip({ children, content }: TooptipProps): JSX.Element {
  return (
    <TooltipProvider>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
