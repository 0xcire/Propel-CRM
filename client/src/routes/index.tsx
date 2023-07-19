import { type RouteObject, useRoutes } from 'react-router-dom';
import { useUser } from '@/lib/react-query-auth';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import { Welcome, NotFound } from '@/features/misc';

export const Routes = (): JSX.Element => {
  const user = useUser({
    retry: false,
  });

  // TODO: figure out a better flow. User is logged in and coming back to site, should just be redirected to app. Issue with BrowserRouter, though.
  const welcome: Array<RouteObject> = [
    { path: '/', element: <Welcome /> },
    { path: '*', element: <NotFound /> },
  ];

  const routes = user.data ? privateRoutes : publicRoutes;

  const element = useRoutes([...welcome, ...routes]);
  return <>{element}</>;
};
