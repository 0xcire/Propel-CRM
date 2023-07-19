import type { ReactNode } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary as ErrorWrapper } from 'react-error-boundary';

import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';

// TODO: this children: ReactNode type is common. extract.
type ErrorBoundaryProps = {
  children: ReactNode | Array<ReactNode>;
};

type ErrorProps = {
  resetErrorBoundary: () => void;
};

export function ErrorBoundary({ children }: ErrorBoundaryProps): JSX.Element {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorWrapper
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }): ReactNode => (
        <Error resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorWrapper>
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
