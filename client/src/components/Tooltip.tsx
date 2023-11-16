import {
  Tooltip as TooltipRoot,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import type { PropsWithChildren } from 'react';

type TooptipProps = PropsWithChildren<{
  content: string;
}>;

export function Tooltip({ children, content }: TooptipProps): JSX.Element {
  return (
    <TooltipProvider>
      <TooltipRoot delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='border-border'>
          <p>{content}</p>
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
