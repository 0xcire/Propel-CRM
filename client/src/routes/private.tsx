// dashboard
// profile
// listings
// contacts
// tasks
// analytics

import { RouteObject } from 'react-router-dom';
import Protected from '@/components/Protected';
import { Profile } from '@/features/users/routes/Profile';
import { AppLayout } from '@/components/Layout/AppLayout';

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
