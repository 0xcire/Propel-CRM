import { lazyImport } from '@/utils/lazyImport';

const { SignIn } = lazyImport(() => import('./SignIn'), 'SignIn');
const { SignUp } = lazyImport(() => import('./Signup'), 'SignUp');

import type { RouteObject } from 'react-router-dom';

export const authRoutes: Array<RouteObject> = [
  {
    path: '/auth/*',
    children: [
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
    ],
  },
];
