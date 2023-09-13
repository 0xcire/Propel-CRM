import type { ReactNode } from 'react';

export function PageHeader({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className='flex h-full w-full flex-1 flex-col p-10'>
      <div className='flex w-full items-center justify-between'>
        <>{children}</>
      </div>
    </div>
  );
}
