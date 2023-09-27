import type { ComponentWithChild } from '@/types';

export function DashboardItemHeader({
  children,
}: ComponentWithChild): JSX.Element {
  return (
    <div className='flex h-[60px] items-center justify-between px-4'>
      {children}
    </div>
  );
}
