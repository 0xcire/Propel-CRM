import { authRoutes } from '@/features/auth/routes';

import type { RouteObject } from 'react-router-dom';

export const publicRoutes: Array<RouteObject> = [...authRoutes];
