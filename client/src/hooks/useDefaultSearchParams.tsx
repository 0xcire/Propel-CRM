import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import type { DefaultParams } from '@/types';

export const useDefaultSearchParams = (defaultParams: DefaultParams): void => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();

  useEffect(
    () => {
      if (id) return;

      if (searchParams.get('name')) {
        searchParams.delete('name');
        setSearchParams(searchParams);
      }

      if (defaultParams.some((param) => !searchParams.get(param.name))) {
        //
        defaultParams.forEach((param) => {
          searchParams.set(param.name, param.value);
        });
        setSearchParams(searchParams, { replace: true });
      }
    },

    //eslint-disable-next-line
    []
  );
};
