import type { ReactNode } from 'react';

// TODO: consider moving absolute shadow container to per page basis,
// more control per route.

export function PageContent({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className='h-full'>
      <div className='relative flex h-full flex-col rounded-md'>
        <div className='absolute flex h-full w-full flex-col'>{children}</div>
      </div>
    </div>
  );
}
