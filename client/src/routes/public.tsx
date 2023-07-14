// welcome page
// sign in
// sign up
import { SignInForm } from '@/components';
import { SignUpForm } from '@/components';
import { LinkButton } from '@/components';
import { Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

export const publicRoutes: Array<RouteObject> = [
  {
    element: (
      <div className='grid h-screen w-screen place-items-center'>
        <Outlet />
      </div>
    ),
    children: [
      {
        path: '/',
        element: (
          <div className='p-4 md:p-0'>
            <h1 className='scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl'>
              Propel CRM
            </h1>
            <p>
              "Elevate Your Real Estate Success with Our Cutting-Edge CRM
              Solution."
            </p>
            <div className='flex'>
              <LinkButton
                className='m-1 ml-0 w-1/3'
                text='Sign In'
                path='/signin'
              />
              <LinkButton
                className='m-1 ml-0 w-1/3'
                text='Sign Up'
                path='/signup'
              />
              <LinkButton
                className='m-1 ml-0 w-1/3'
                text='View Demo'
                path='/signin'
              />
            </div>
          </div>
        ),
      },
      {
        path: '/signin',
        element: <SignInForm />,
      },
      {
        path: '/signup',
        element: <SignUpForm />,
      },
      {
        path: '*',
        element: <div>404</div>,
      },
    ],
  },
];
