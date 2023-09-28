import type { ReactNode } from 'react';

export function PageContent({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className='h-full pt-10'>
      <div className='relative flex h-full flex-col rounded-md border shadow-md'>
        <div className='absolute flex h-full w-full flex-col'>{children}</div>
      </div>
    </div>
  );
}
