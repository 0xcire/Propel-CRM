import type { ComponentWithChild } from '@/types';

export function DashboardItemContent({
  children,
}: ComponentWithChild): JSX.Element {
  return <div className='absolute h-[calc(100%-60px)] w-full'>{children}</div>;
}
