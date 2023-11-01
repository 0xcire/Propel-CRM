import type { PropsWithChildren } from 'react';

export function PageContent({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className='h-full'>
      <div className='relative flex h-full flex-col rounded-md'>
        <div className='absolute flex h-full w-full flex-col'>{children}</div>
      </div>
    </div>
  );
}
