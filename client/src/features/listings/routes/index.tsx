// import { lazyImport } from '@/utils/lazyImport';

import { lazyImport } from '@/utils/lazyImport';
import { Suspense } from 'react';

import { ListingProvider } from '../context/ListingPageContext';

const { ListingPage } = lazyImport(
  () => import('../components/page'),
  'ListingPage'
);

import type { RouteObject } from 'react-router-dom';

export const listingRoutes: RouteObject = {
  path: 'listings',
  children: [
    {
      index: true,
      element: (
        // TODO: better fallback
        <Suspense>
          <ListingProvider>
            <ListingPage />
          </ListingProvider>
        </Suspense>
      ),
    },
    {
      path: ':id',
      element: <p>hey listing ID</p>,
    },
  ],
};
