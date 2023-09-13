// import { lazyImport } from '@/utils/lazyImport';

import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import type { RouteObject } from 'react-router-dom';

export const contactRoutes: RouteObject = {
  path: 'contacts',
  children: [
    {
      index: true,
      element: (
        <div className='flex h-full w-full flex-1 flex-col p-10'>
          <div className='flex w-full items-center justify-between'>
            <Typography variant='h3'>All Contacts</Typography>
            <Button>Add Contact</Button>
          </div>
          <div className='h-full pt-10'>
            <div className='border-1 grid h-full place-items-center rounded-md shadow-md'>
              <div>
                <p>Search Contacts</p>
                <p>Many Contacts</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      path: ':id',
      element: <p>hey contact ID</p>,
    },
  ],
};
