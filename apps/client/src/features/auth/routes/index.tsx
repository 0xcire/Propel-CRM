import { lazyImport } from '@/utils/lazyImport';

const { SignIn } = lazyImport(() => import('./SignIn'), 'SignIn');
const { SignUp } = lazyImport(() => import('./Signup'), 'SignUp');
const { Recovery } = lazyImport(() => import('./Recovery'), 'Recovery');
const { ResetPassword } = lazyImport(
  () => import('./ResetPassword'),
  'ResetPassword'
);

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
      {
        path: 'recovery',
        element: <Recovery />,
      },
      {
        path: 'recovery/:id',
        element: <ResetPassword />,
      },
    ],
  },
];
