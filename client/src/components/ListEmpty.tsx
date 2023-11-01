import type { PropsWithChildren } from 'react';

export function ListEmpty({ children }: PropsWithChildren): JSX.Element {
  return (
    <div className='grid h-full w-full place-items-center'>
      <p className='text-slate-500'>{children}</p>
    </div>
  );
}
