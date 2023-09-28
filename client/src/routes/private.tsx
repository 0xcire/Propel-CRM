import { lazyImport } from '@/utils/lazyImport';

const { Dashboard } = lazyImport(() => import('@/features/misc'), 'Dashboard');
const { Profile } = lazyImport(
  () => import('@/features/users/routes/Profile'),
  'Profile'
);
const { AppLayout } = lazyImport(
  () => import('@/components/Layout/AppLayout'),
  'AppLayout'
);

import { listingRoutes } from '@/features/listings/routes';
import { contactRoutes } from '@/features/contacts/routes';
import { taskRoutes } from '@/features/tasks/routes';
import { analyticsRoutes } from '@/features/analytics/routes';

import type { RouteObject } from 'react-router-dom';

export const privateRoutes: Array<RouteObject> = [
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/profile', element: <Profile /> },
      listingRoutes,
      contactRoutes,
      taskRoutes,
      analyticsRoutes,
    ],
  },
];
