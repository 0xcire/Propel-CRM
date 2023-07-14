import { publicRoutes } from './public';
import { privateRoutes } from './private';

const isAuthorized = false;

const routes = isAuthorized ? privateRoutes : publicRoutes;

export default routes;
