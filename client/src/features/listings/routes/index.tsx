import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { ListingPage } = lazyImport(
  () => import('../components/page'),
  'ListingPage'
);

const { ListingRoute } = lazyImport(
  () => import('../components/page/ListingRoute'),
  'ListingRoute'
);

import type { RouteObject } from 'react-router-dom';

export const listingRoutes: RouteObject = {
  path: 'listings',
  element: (
    // TODO: skeleton with rest of layout?
    <Suspense>
      <ListingPage />
    </Suspense>
  ),
  children: [
    {
      path: ':id',
      element: (
        <Suspense>
          <ListingRoute />
        </Suspense>
      ),
    },
  ],
};
