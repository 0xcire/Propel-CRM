import { type RouteObject, useRoutes } from 'react-router-dom';
import { useUser } from '@/lib/react-query-auth';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import { Welcome, NotFound } from '@/features/misc';
// import { Spinner } from '@/components';

export const Routes = (): JSX.Element => {
  const user = useUser();

  const welcome: Array<RouteObject> = [
    { path: '/', element: <Welcome /> },
    { path: '*', element: <NotFound /> },
  ];

  const routes = user.data ? privateRoutes : publicRoutes;

  const element = useRoutes([...welcome, ...routes]);

  // TODO: yet another place to replace
  // if (user.isLoading) {
  //   return (
  //     <div className='grid h-screen place-items-center'>
  //       <Spinner variant='md' />
  //     </div>
  //   );
  // }

  return <>{element}</>;
};
