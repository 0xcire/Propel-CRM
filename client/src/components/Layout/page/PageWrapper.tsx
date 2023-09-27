import { useDocumentTitle } from '@/hooks';
import { ReactNode } from 'react';

export function PageWrapper({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}): JSX.Element {
  useDocumentTitle(title);
  return (
    <div className='flex h-full w-full flex-1 flex-col p-10'>{children}</div>
  );
}
