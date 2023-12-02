import { Suspense } from 'react';
import { lazyImport } from '@/utils/lazyImport';

const { TaskProvider } = lazyImport(
  () => import('../context/TaskContext'),
  'TaskProvider'
);

const { TaskLayout } = lazyImport(
  () => import('../components/Layout'),
  'TaskLayout'
);

const { TaskPage } = lazyImport(() => import('../components/page'), 'TaskPage');
const { TaskRoute } = lazyImport(
  () => import('../components/page/TaskRoute'),
  'TaskRoute'
);

const { ListingTaskPage } = lazyImport(
  () => import('../components/page/ListingTaskPage'),
  'ListingTaskPage'
);
const { ContactTaskPage } = lazyImport(
  () => import('../components/page/ContactTaskPage'),
  'ContactTaskPage'
);

import type { RouteObject } from 'react-router-dom';

export const taskRoutes: RouteObject = {
  path: 'tasks',

  element: (
    <Suspense>
      <TaskProvider>
        <TaskLayout />
      </TaskProvider>
    </Suspense>
  ),
  children: [
    {
      index: true,
      element: (
        <Suspense>
          <TaskPage />
        </Suspense>
      ),
    },
    {
      path: ':id',
      element: (
        <Suspense>
          <TaskRoute />
        </Suspense>
      ),
    },
    {
      path: 'listings/:listingID',
      element: (
        <Suspense>
          <ListingTaskPage />
        </Suspense>
      ),
    },
    {
      path: 'contacts/:contactID',
      element: (
        <Suspense>
          <ContactTaskPage />
        </Suspense>
      ),
    },
    // {
    //   path: ':categoryID',
    //   element: (
    //     <Suspense>

    //       <TaskCategoryRoute />
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: ':id',
    //   element: (
    //     <Suspense>
    //       <TaskRoute />
    //     </Suspense>
    //   ),
    // },
    // {
    //   path: ':id/update',
    // },
    // {
    //   path: ':id/delete',
    // },
    // {
    //   path: ':id/update',
    // },
  ],
};
