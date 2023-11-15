import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

import { ContactLayout } from '../components/Layout';

const { ContactPage } = lazyImport(
  () => import('../components/page'),
  'ContactPage'
);

const { ContactRoute } = lazyImport(
  () => import('../components/page/ContactRoute'),
  'ContactRoute'
);

import type { RouteObject } from 'react-router-dom';

export const contactRoutes: RouteObject = {
  path: 'contacts',
  element: <ContactLayout />,
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <ContactPage />
        </Suspense>
      ),
    },
    {
      path: ':contactID',
      element: (
        <Suspense>
          <ContactRoute />
        </Suspense>
      ),
    },
  ],
};
