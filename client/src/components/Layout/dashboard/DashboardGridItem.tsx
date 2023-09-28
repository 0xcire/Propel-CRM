import { twMerge } from 'tailwind-merge';

import type { ComponentWithChild } from '@/types';

interface DashboardGridItemProps extends ComponentWithChild {
  className: string;
}

export function DashboardGridItem({
  children,
  className,
}: DashboardGridItemProps): JSX.Element {
  return (
    <div className={twMerge('relative rounded border shadow', className)}>
      {children}
    </div>
  );
}
