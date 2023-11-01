import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { PropsWithChildren } from 'react';

export function TaskPageWrapper({ children }: PropsWithChildren): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get('page') || !searchParams.get('completed')) {
      setSearchParams(
        [
          ['page', '1'],
          ['completed', 'false'],
        ],
        {
          replace: true,
        }
      );
    }

    //eslint-disable-next-line
  }, []);
  return <>{children}</>;
}
