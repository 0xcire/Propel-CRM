import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

// TODO:
// potentially moved this into shared directory containing other 'search contacts'
// feature code

export const useNameQuerySearchParams = (
  debouncedNameQuery: string | undefined
): void => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (
      (debouncedNameQuery === '' || !debouncedNameQuery) &&
      searchParams.get('name')
    ) {
      searchParams.delete('name');
      setSearchParams(searchParams);
    }

    if (debouncedNameQuery) {
      searchParams.set('name', debouncedNameQuery);
      setSearchParams(searchParams);
    }

    // eslint-disable-next-line
  }, [debouncedNameQuery]);
};
