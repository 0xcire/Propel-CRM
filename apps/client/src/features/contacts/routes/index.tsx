import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { ContactLayout } = lazyImport(
  () => import('../components/Layout'),
  'ContactLayout'
);

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
  element: (
    <Suspense>
      <ContactLayout />
    </Suspense>
  ),
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
