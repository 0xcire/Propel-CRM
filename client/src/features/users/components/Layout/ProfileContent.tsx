import type { PropsWithChildren } from 'react';

type ProfileContentProps = PropsWithChildren;

export function ProfileContent({ children }: ProfileContentProps): JSX.Element {
  return <div className='w-5/6 max-w-[500px] xl:w-5/12'>{children}</div>;
}
