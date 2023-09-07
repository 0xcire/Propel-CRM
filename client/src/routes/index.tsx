import { type RouteObject, useRoutes } from 'react-router-dom';
import { useUser } from '@/lib/react-query-auth';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import { Welcome, NotFound } from '@/features/misc';
import { Spinner } from '@/components';

export const Routes = (): JSX.Element => {
  const user = useUser();
  // TODO: figure out a better flow. User is logged in and coming back to site, should just be redirected to app. Issue with BrowserRouter, though.
  const welcome: Array<RouteObject> = [
    { path: '/', element: <Welcome /> },
    { path: '*', element: <NotFound /> },
  ];

  const routes = user.data ? privateRoutes : publicRoutes;

  const element = useRoutes([...welcome, ...routes]);

  if (user.isLoading) {
    return (
      <div className='grid h-screen place-items-center'>
        <Spinner variant='md' />
      </div>
    );
  }

  return <>{element}</>;
};
