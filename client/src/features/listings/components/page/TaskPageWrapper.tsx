import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function TaskPageWrapper({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
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
