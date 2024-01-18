import { twMerge } from 'tailwind-merge';
import type { PropsWithChildren } from 'react';

interface ContactGridItemProps extends PropsWithChildren {
  className: string;
}

export function ContactGridItem({
  className,
  children,
}: ContactGridItemProps): JSX.Element {
  return (
    <div
      className={twMerge(
        'rounded-md border border-border p-2 shadow lg:p-4',
        className
      )}
    >
      {children}
    </div>
  );
}
