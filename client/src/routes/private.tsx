// dashboard
// profile
// listings
// contacts
// tasks
// analytics

import { lazyImport } from '@/utils/lazyImport';

const { Protected } = lazyImport(
  () => import('@/components/Protected'),
  'Protected'
);
const { Profile } = lazyImport(
  () => import('@/features/users/routes/Profile'),
  'Profile'
);
const { AppLayout } = lazyImport(
  () => import('@/components/Layout/AppLayout'),
  'AppLayout'
);

import type { RouteObject } from 'react-router-dom';

export const privateRoutes: Array<RouteObject> = [
  {
    element: <AppLayout />,
    children: [
      { path: '/protected', element: <Protected /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
];

// dashboard || app
// // listings/{:id}
// // contacts/{:id}
// // tasks/{:id}
// // analytics/
