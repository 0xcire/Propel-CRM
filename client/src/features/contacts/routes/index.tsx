import { lazyImport } from '@/utils/lazyImport';
import { Suspense } from 'react';

const { ContactPage } = lazyImport(
  () => import('../components/page'),
  'ContactPage'
);

import type { RouteObject } from 'react-router-dom';

export const contactRoutes: RouteObject = {
  path: 'contacts',
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
      path: ':id',
      element: <p>hey contact ID</p>,
    },
  ],
};
