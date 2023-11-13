import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { DefaultParams } from '@/types';

export const useDefaultSearchParams = (defaultParams: DefaultParams): void => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(
    () => {
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
