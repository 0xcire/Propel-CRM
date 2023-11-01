import { ErrorBoundary as ErrorBoundaryWrapper } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

import type { PropsWithChildren, ReactNode } from 'react';

type ErrorBoundaryProps = PropsWithChildren;

type ErrorProps = {
  resetErrorBoundary: () => void;
};

export function ErrorBoundary({ children }: ErrorBoundaryProps): JSX.Element {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundaryWrapper
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }): ReactNode => (
        <Error resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundaryWrapper>
  );
}

function Error({ resetErrorBoundary }: ErrorProps): JSX.Element {
  return (
    <div className='grid h-screen w-full place-items-center'>
      <div>
        <Typography variant='h3'>Uh Oh! Something went wrong.</Typography>
        <Button onClick={(): void => resetErrorBoundary()}>Try Again</Button>
      </div>
    </div>
  );
}
