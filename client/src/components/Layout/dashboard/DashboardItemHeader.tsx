import type { PropsWithChildren } from 'react';

export function DashboardItemHeader({
  children,
}: PropsWithChildren): JSX.Element {
  return (
    <div className='flex h-[60px] items-center justify-between px-4'>
      {children}
    </div>
  );
}
