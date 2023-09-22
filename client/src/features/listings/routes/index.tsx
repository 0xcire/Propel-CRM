import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

const { ListingPage } = lazyImport(
  () => import('../components/page'),
  'ListingPage'
);

const { Listing } = lazyImport(
  () => import('../components/page/Listing'),
  'Listing'
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
      element: <Listing />,
    },
  ],
};
