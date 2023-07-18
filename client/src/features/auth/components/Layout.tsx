import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ReactNode } from 'react';

type LayoutProps = {
  title: string;
  children: ReactNode;
};

export function Layout({ title, children }: LayoutProps): JSX.Element {
  useDocumentTitle(title);

  return (
    <div className='grid h-screen w-screen place-items-center'>
      <>{children}</>
    </div>
  );
}
