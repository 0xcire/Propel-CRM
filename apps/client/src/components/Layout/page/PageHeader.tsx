import { useIsDesktop } from '@/hooks/useIsDesktop';

import { Typography } from '../../ui/typography';
import { Navbar } from '../../Navbar';

import type { PropsWithChildren } from 'react';

interface PageHeaderProps extends PropsWithChildren {
  text: string;
}

export function PageHeader({ children, text }: PageHeaderProps): JSX.Element {
  const isDesktop = useIsDesktop();
  return (
    <div className='flex w-full items-center justify-between'>
      <div className='flex items-center gap-2'>
        {!isDesktop && <Navbar />}
        <Typography
          variant='h3'
          className='line-clamp-1 text-[22px] font-black antialiased'
        >
          {text}
        </Typography>
      </div>
      {children}
    </div>
  );
}
