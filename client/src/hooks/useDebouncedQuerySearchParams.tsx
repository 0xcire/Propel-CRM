import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useDebounce } from './useDebounce';

import type { Dispatch, SetStateAction } from 'react';

export const useDebouncedQuerySearchParams = (
  param: 'name' | 'address' | 'title'
): { setQuery: Dispatch<SetStateAction<string | undefined>> } => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebounce(query, 200);

  const searchParam = searchParams.get(param);

  useEffect(() => {
    if (searchParam && !debouncedQuery) return; //handles page refreshes for table search

    if (debouncedQuery) {
      searchParams.set(param, debouncedQuery);
      setSearchParams(searchParams);
    }

    // eslint-disable-next-line
  }, [debouncedQuery]);

  return {
    setQuery,
  };
};
