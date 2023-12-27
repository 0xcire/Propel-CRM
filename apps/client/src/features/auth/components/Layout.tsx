import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import type { PropsWithChildren } from 'react';

type LayoutProps = PropsWithChildren<{
  title: string;
}>;

export function Layout({ title, children }: LayoutProps): JSX.Element {
  useDocumentTitle(title);

  return (
    <div className='grid h-screen w-screen place-items-center'>
      <>{children}</>
    </div>
  );
}
