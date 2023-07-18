import { RouteObject } from 'react-router-dom';
import { SignIn } from './SignIn';
import { SignUp } from './Signup';

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
