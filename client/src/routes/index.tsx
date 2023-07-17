import { useRoutes } from 'react-router-dom';
import { useUser } from '@/lib/react-query-auth';
import { publicRoutes } from './public';
import { privateRoutes } from './private';

export const Routes = (): JSX.Element => {
  const user = useUser({
    retry: false,
  });

  const routes = user.data ? privateRoutes : publicRoutes;

  const element = useRoutes(routes);
  return <>{element}</>;
};
