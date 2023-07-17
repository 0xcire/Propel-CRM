// welcome page
// sign in
import { authRoutes } from '@/features/auth/routes';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: Array<RouteObject> = [...authRoutes];
