import type { PropsWithChildren } from 'react';

export function DashboardItemContent({
  children,
}: PropsWithChildren): JSX.Element {
  return <div className='absolute h-[calc(100%-60px)] w-full'>{children}</div>;
}
