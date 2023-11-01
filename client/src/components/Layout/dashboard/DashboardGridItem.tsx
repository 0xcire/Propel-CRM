import { twMerge } from 'tailwind-merge';

import type { PropsWithChildren } from 'react';

interface DashboardGridItemProps extends PropsWithChildren {
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
