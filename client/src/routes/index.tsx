import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { useUser } from '@/lib/react-query-auth';

import { publicRoutes } from './public';
import { privateRoutes } from './private';

import { Welcome } from '@/features/misc';
const { NotFound } = lazyImport(() => import('@/features/misc'), 'NotFound');
import { Spinner } from '@/components';

import { lazyImport } from '@/utils/lazyImport';
import { isLoggedIn } from '@/utils';

import type { RouteObject } from 'react-router-dom';

export const Routes = (): JSX.Element => {
  const user = useUser();

  const welcome: Array<RouteObject> = [
    { path: '/', element: <Welcome /> },
    { path: '*', element: <NotFound /> },
  ];

  const loggedIn = isLoggedIn(user);
  const routes = loggedIn ? privateRoutes : publicRoutes;
  const element = useRoutes([...welcome, ...routes]);

  // TODO: yet another place to replace
  if (user.isInitialLoading || user.isLoading || user.isFetching) {
    return (
      <div className='grid h-screen place-items-center'>
        <Spinner variant='md' />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className='grid h-screen place-items-center'>
          <Spinner variant='md' />
        </div>
      }
    >
      {element}
    </Suspense>
  );
};
