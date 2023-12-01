import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import type { PropsWithChildren } from 'react';

interface PageWrapperProps extends PropsWithChildren {
  title: string;
}

export function PageWrapper({
  children,
  title,
}: PageWrapperProps): JSX.Element {
  useDocumentTitle(title);
  return (
    <div className='flex h-full w-full flex-1 flex-col px-6 py-4'>
      {children}
    </div>
  );
}
