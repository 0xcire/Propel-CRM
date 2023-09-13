import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { ReactNode } from 'react';

export function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): JSX.Element {
  useDocumentTitle(title);
  return (
    <>
      <PageLayoutHeading />
      {children}
    </>
  );
}

export function PageLayoutHeading(): JSX.Element {
  return <></>;
}
