import { Suspense } from 'react';

import { lazyImport } from '@/utils/lazyImport';

import { ListingLayout } from '../components/Layout';

const { ListingPage } = lazyImport(
  () => import('../components/page'),
  'ListingPage'
);

const { ListingRoute } = lazyImport(
  () => import('../components/page/ListingRoute'),
  'ListingRoute'
);

import type { RouteObject } from 'react-router-dom';

// TODO: skeleton with rest of layout?

// TODO: figure out showing listing table in background when on listing route

export const listingRoutes: RouteObject = {
  path: 'listings',
  element: <ListingLayout />,
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <ListingPage />
        </Suspense>
      ),
    },
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
