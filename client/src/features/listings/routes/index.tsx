// import { lazyImport } from '@/utils/lazyImport';

import { ListingPage } from '../components/page';

import type { RouteObject } from 'react-router-dom';

export const listingRoutes: RouteObject = {
  path: 'listings',
  children: [
    {
      index: true,
      element: <ListingPage />,
    },
    {
      path: ':id',
      element: <p>hey listing ID</p>,
    },
  ],
};
