import { lazyImport } from '@/utils/lazyImport';
import { Suspense } from 'react';

import { ListingProvider } from '../context/ListingPageContext';

const { ListingPage } = lazyImport(
  () => import('../components/page'),
  'ListingPage'
);
import { Listing } from '../components/page/Listing';

import type { RouteObject } from 'react-router-dom';

export const listingRoutes: RouteObject = {
  path: 'listings',
  element: (
    <Suspense>
      <ListingProvider>
        <ListingPage />
      </ListingProvider>
    </Suspense>
  ),
  children: [
    {
      path: ':id',
      element: <Listing />,
    },
  ],
};
