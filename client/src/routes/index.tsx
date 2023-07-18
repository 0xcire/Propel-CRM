import { useRoutes } from 'react-router-dom';
import { useUser } from '@/lib/react-query-auth';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import { Welcome } from '@/features/misc';

export const Routes = (): JSX.Element => {
  const user = useUser({
    retry: false,
  });

  const welcome = [{ path: '/', element: <Welcome /> }];

  const routes = user.data ? privateRoutes : publicRoutes;

  const element = useRoutes([...welcome, ...routes]);
  return <>{element}</>;
};
