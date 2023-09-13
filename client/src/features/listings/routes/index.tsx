// import { lazyImport } from '@/utils/lazyImport';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import type { RouteObject } from 'react-router-dom';

export const listingRoutes: RouteObject = {
  path: 'listings',
  children: [
    {
      index: true,
      element: (
        <div className='flex h-full w-full flex-1 flex-col p-10'>
          <div className='flex w-full items-center justify-between'>
            <Typography variant='h3'>All Listings</Typography>
            <Button>Add Listing</Button>
          </div>
          <div className='h-full pt-10'>
            <div className='border-1 grid h-full place-items-center rounded-md shadow-md'>
              <p>All Listings</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      path: ':id',
      element: <p>hey listing ID</p>,
    },
  ],
};
