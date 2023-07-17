import { RouteObject } from 'react-router-dom';
import { SignIn } from './SignIn';
import { SignUp } from './Signup';
import { WelcomePage } from './WelcomePage';

export const authRoutes: Array<RouteObject> = [
  {
    path: '/',
    element: <WelcomePage />,
  },
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
